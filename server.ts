import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import morgan from 'morgan';
import { nanoid } from 'nanoid';
import generateRouter from './server/routes/generate.ts';

import dataRoomRouter from './server/routes/dataRoom.ts';
import investorsRouter from './server/routes/investors.ts';
import { getDb } from './server/firebaseAdmin.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Fix express-rate-limit proxy trust issues behind ingress/load balancers
  app.set('trust proxy', 1);

  // Add request ID and basic structured logging preparation
  app.use((req, res, next) => {
    req.headers['x-request-id'] = req.headers['x-request-id'] || nanoid();
    next();
  });

  app.use(morgan((tokens, req, res) => {
    return JSON.stringify({
      requestId: req.headers['x-request-id'],
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      latencyMs: tokens['response-time'](req, res),
      uid: req.headers['x-user-uid'] || undefined,
    });
  }, {
    skip: (req) => !req.url.startsWith('/api')
  }));

  // CORS configuration
  const allowedOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',') 
    : ['http://localhost:5173', 'http://localhost:3000'];

  app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: true,
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api', generateRouter);
  app.use('/api/investors', investorsRouter);
  app.use('/api/data-room-links', dataRoomRouter);
  app.use('/api/export', (await import('./server/routes/export.ts')).default);
  app.use('/api/outreach', (await import('./server/routes/outreach.ts')).default);

  // PayPal Configuration
  const getPayPalConfig = () => {
    const env = (process.env.PAYPAL_ENV || "sandbox").toLowerCase();
    const isLive = env === "live";

    const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

    const clientId = isLive ? process.env.PAYPAL_LIVE_CLIENT_ID : process.env.PAYPAL_SANDBOX_CLIENT_ID;
    const secret = isLive ? process.env.PAYPAL_LIVE_SECRET : process.env.PAYPAL_SANDBOX_SECRET;
    const webhookId = isLive ? process.env.PAYPAL_LIVE_WEBHOOK_ID : process.env.PAYPAL_SANDBOX_WEBHOOK_ID;

    if (!clientId || !secret) {
      console.warn(`PayPal credentials missing for PAYPAL_ENV=${env}. Set PAYPAL_${isLive ? "LIVE" : "SANDBOX"}_CLIENT_ID and PAYPAL_${isLive ? "LIVE" : "SANDBOX"}_SECRET`);
      return null;
    }

    return { env, isLive, baseUrl, clientId: clientId.trim(), secret: secret.trim(), webhookId: webhookId?.trim() };
  };

  const getPayPalAccessToken = async () => {
    const config = getPayPalConfig();
    if (!config) throw new Error("PayPal configuration missing");
    
    const { baseUrl, clientId, secret } = config;

    // IMPORTANT: trim and ensure no accidental newline characters
    const basic = Buffer.from(`${clientId}:${secret}`, "utf8").toString("base64");

    const body = new URLSearchParams({ grant_type: "client_credentials" }).toString();

    const resp = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!resp.ok) {
      const text = await resp.text();
      // Return PayPal error details in a useful way
      throw new Error(`Failed to get PayPal access token: ${text}`);
    }

    const data = (await resp.json()) as { access_token: string };
    if (!data.access_token) throw new Error("PayPal access token response missing access_token");

    return data.access_token;
  };

  const verifyPayPalWebhook = async (req: express.Request) => {
    const config = getPayPalConfig();
    if (!config) return false;

    const { baseUrl, webhookId } = config;
    if (!webhookId) {
      // In production, we MUST verify webhooks.
      if (process.env.NODE_ENV === 'production' && config.isLive) {
        console.error('PAYPAL_WEBHOOK_ID is critically missing in production. Failing webhook verification.');
        return false;
      }
      console.warn('PAYPAL_WEBHOOK_ID is missing. Skipping signature verification.');
      return true; // Skip verification if ID is not set (for initial setup) in non-prod
    }

    try {
      const accessToken = await getPayPalAccessToken();
      const verificationPayload = {
        transmission_id: req.headers['paypal-transmission-id'],
        transmission_time: req.headers['paypal-transmission-time'],
        cert_url: req.headers['paypal-cert-url'],
        auth_algo: req.headers['paypal-auth-algo'],
        transmission_sig: req.headers['paypal-transmission-sig'],
        webhook_id: webhookId,
        webhook_event: req.body,
      };

      const response = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationPayload),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('PayPal Webhook Verification Request Failed:', error);
        return false;
      }

      const data = await response.json() as { verification_status: string };
      return data.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('Error verifying PayPal webhook:', error);
      return false;
    }
  };

  // PayPal Webhook Endpoint
  app.post('/api/webhooks/paypal', async (req, res, next) => {
    try {
      const isVerified = await verifyPayPalWebhook(req);
      
      if (!isVerified) {
        console.error('PayPal Webhook Signature Verification Failed');
        return res.status(401).send('Unauthorized');
      }

      const event = req.body;
      console.log('PayPal Webhook Received & Verified:', event.event_type);
      
      const db = getDb();
      
      // Handle the event
      switch (event.event_type) {
        case 'PAYMENT.SALE.COMPLETED':
          console.log('Payment completed for:', event.resource.id);
          break;
        case 'BILLING.SUBSCRIPTION.CREATED':
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
        case 'BILLING.SUBSCRIPTION.CANCELLED': {
          console.log(`Subscription ${event.event_type}:`, event.resource.id);
          
          // Custom ID often holds the UID
          const uid = event.resource.custom_id;
          
          if (uid) {
            const status = event.resource.status;
            const planId = event.resource.plan_id;
            
            await db.collection('users').doc(uid).set({
              paypalSubscriptionId: event.resource.id,
              subscriptionStatus: status,
              planId: planId,
              updatedAt: new Date()
            }, { merge: true }).catch(err => {
              console.error('Error updating user subscription details:', err);
            });
            console.log(`Updated subscription status for user ${uid} to ${status}`);
          } else {
            console.log('No custom_id (uid) found in subscription event, cannot update user.');
          }
          break;
        }
        default:
          console.log('Unhandled event type:', event.event_type);
      }

      res.status(200).send('Webhook received');
    } catch(err) {
      next(err);
    }
  });

  // Test PayPal Connection
  app.get('/api/paypal/test', async (req, res) => {
    try {
      const token = await getPayPalAccessToken();
      res.json({ status: 'ok', message: 'Successfully connected to PayPal', hasToken: !!token });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : String(error) });
    }
  });

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[Server Error]', err.stack);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
