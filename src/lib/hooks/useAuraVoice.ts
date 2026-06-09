// src/lib/hooks/useAuraVoice.ts

import { useEffect, useRef, useState, useCallback } from 'react';

export type AuraVoiceStatus =
  | 'idle'
  | 'connecting'
  | 'ready'
  | 'streaming'
  | 'error'
  | 'closed';

export interface AuraVoiceOptions {
  url: string;
  /**
   * Optional auth token or API key. Never hard-code secrets here –
   * pass a short-lived token from your backend.
   */
  token?: string;
  /**
   * Ping interval in milliseconds. Defaults to 15s.
   */
  heartbeatIntervalMs?: number;
  /**
   * Timeout for initial connection (ms). Defaults to 10s.
   */
  connectTimeoutMs?: number;
}

export interface AuraVoiceHook {
  status: AuraVoiceStatus;
  lastError: string | null;
  /**
   * Send a JSON-serializable payload to the voice server.
   */
  send: (payload: unknown) => void;
  /**
   * Start streaming raw binary/audio frames (already encoded as required by backend).
   */
  sendBinary: (data: ArrayBuffer | Uint8Array) => void;
  /**
   * Request a manual reconnect if the socket is closed or in error.
   */
  reconnect: () => void;
  /**
   * Stop and clean up the current WebSocket session.
   */
  disconnect: () => void;
}

/**
 * Robust WebSocket hook for the Aura voice agent.
 *
 * - Wraps construction in try/catch so "closed without opened" is handled gracefully.
 * - Adds heartbeat ping/pong to keep idle connections alive and detect dead sockets.
 * - Exposes explicit reconnect / disconnect controls.
 * - Emits user-facing errors instead of crashing the console.
 */
export function useAuraVoice(options: AuraVoiceOptions): AuraVoiceHook {
  const {
    url,
    token,
    heartbeatIntervalMs = 15000,
    connectTimeoutMs = 10000,
  } = options;

  const [status, setStatus] = useState<AuraVoiceStatus>('idle');
  const [lastError, setLastError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const connectTimeoutRef = useRef<number | null>(null);
  const manuallyClosedRef = useRef(false);

  const clearHeartbeat = () => {
    if (heartbeatRef.current != null) {
      window.clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  };

  const clearConnectTimeout = () => {
    if (connectTimeoutRef.current != null) {
      window.clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
  };

  const safeClose = useCallback((code?: number, reason?: string) => {
    const ws = socketRef.current;
    if (!ws) return;
    try {
      manuallyClosedRef.current = true;
      ws.close(code, reason);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[IdealApp][AuraVoice] Error closing WebSocket', e);
    } finally {
      socketRef.current = null;
      clearHeartbeat();
      clearConnectTimeout();
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    clearHeartbeat();

    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    heartbeatRef.current = window.setInterval(() => {
      const current = socketRef.current;
      if (!current || current.readyState !== WebSocket.OPEN) {
        clearHeartbeat();
        return;
      }

      try {
        current.send(JSON.stringify({ type: 'ping', ts: Date.now() }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          '[IdealApp][AuraVoice] Failed to send heartbeat ping, closing socket',
          error,
        );
        safeClose(4000, 'heartbeat_failed');
      }
    }, heartbeatIntervalMs);
  }, [heartbeatIntervalMs, safeClose]);

  const connect = useCallback(() => {
    if (!url) {
      setStatus('error');
      setLastError('Missing Aura Voice WebSocket URL');
      return;
    }

    // Clean up any previous socket/heartbeat first.
    safeClose();
    clearHeartbeat();
    clearConnectTimeout();

    manuallyClosedRef.current = false;
    setStatus('connecting');
    setLastError(null);

    let ws: WebSocket;
    try {
      const wsUrl = token ? `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}` : url;
      ws = new WebSocket(wsUrl);
    } catch (error) {
      // Typical case for "WebSocket closed without opened" when the constructor throws.
      // eslint-disable-next-line no-console
      console.error('[IdealApp][AuraVoice] Failed to construct WebSocket', error);
      setStatus('error');
      setLastError('Unable to open audio channel. Please check your connection and try again.');
      socketRef.current = null;
      return;
    }

    socketRef.current = ws;

    // Connection timeout safeguard: if we don't reach OPEN within connectTimeoutMs, abort.
    connectTimeoutRef.current = window.setTimeout(() => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.CONNECTING) {
        return;
      }
      // eslint-disable-next-line no-console
      console.warn(
        '[IdealApp][AuraVoice] WebSocket connect timeout; closing stalled connection',
      );
      setStatus('error');
      setLastError(
        'Voice connection timed out. Please check your network or try again in a moment.',
      );
      safeClose(4001, 'connect_timeout');
    }, connectTimeoutMs);

    ws.onopen = () => {
      clearConnectTimeout();
      // eslint-disable-next-line no-console
      console.info('[IdealApp][AuraVoice] WebSocket connected');
      setStatus('ready');
      startHeartbeat();
    };

    ws.onmessage = (event: MessageEvent) => {
      // Application-level protocol messages.
      try {
        const data =
          typeof event.data === 'string'
            ? JSON.parse(event.data)
            : event.data;

        if (data && typeof data === 'object') {
          if (data.type === 'pong') {
            // Heartbeat response – keep-alive only.
            return;
          }

          if (data.type === 'session.ready') {
            setStatus('ready');
            return;
          }

          if (data.type === 'reply.audio' || data.type === 'stream.started') {
            setStatus('streaming');
          }

          if (data.type === 'stream.ended') {
            setStatus('ready');
          }

          if (data.type === 'error') {
            const message =
              data.message ||
              data.error ||
              'Unknown error from voice service';
            setStatus('error');
            setLastError(message);
            // eslint-disable-next-line no-console
            console.error('[IdealApp][AuraVoice] Server error', data);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(
          '[IdealApp][AuraVoice] Failed to parse WebSocket message',
          error,
          event.data,
        );
      }
    };

    ws.onerror = (event: Event) => {
      // Browser provides minimal diagnostics here; treat as a soft error.
      // eslint-disable-next-line no-console
      console.error('[IdealApp][AuraVoice] WebSocket error event', event);
      if (!manuallyClosedRef.current) {
        setStatus('error');
        setLastError(
          'Audio connection encountered an error. You can retry, or continue with text.',
        );
      }
    };

    ws.onclose = (event: CloseEvent) => {
      clearHeartbeat();
      clearConnectTimeout();
      socketRef.current = null;

      // eslint-disable-next-line no-console
      console.warn(
        '[IdealApp][AuraVoice] WebSocket closed',
        `code=${event.code} reason=${event.reason}`,
      );

      if (manuallyClosedRef.current) {
        setStatus('closed');
        return;
      }

      // Handle "closed without ever opening" and other abnormal closes defensively.
      if (event.code === 1006) {
        setStatus('error');
        setLastError(
          'Could not establish a stable audio connection. This often happens on weak networks or VPNs.',
        );
      } else if (event.code >= 4000 && event.code < 5000) {
        setStatus('error');
        setLastError(
          event.reason ||
            'Voice session ended due to a server policy or timeout. Please reconnect to continue.',
        );
      } else {
        setStatus('closed');
      }
    };
  }, [url, token, connectTimeoutMs, safeClose, startHeartbeat]);

  const send = useCallback(
    (payload: unknown) => {
      const ws = socketRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        // eslint-disable-next-line no-console
        console.warn(
          '[IdealApp][AuraVoice] Attempted to send message on non-open socket',
        );
        setLastError('Voice connection is not active. Please reconnect.');
        return;
      }

      try {
        ws.send(JSON.stringify(payload));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[IdealApp][AuraVoice] Failed to send message', error);
        setStatus('error');
        setLastError('Failed to send audio request. Please try again.');
      }
    },
    [],
  );

  const sendBinary = useCallback(
    (data: ArrayBuffer | Uint8Array) => {
      const ws = socketRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        // eslint-disable-next-line no-console
        console.warn(
          '[IdealApp][AuraVoice] Attempted to send binary on non-open socket',
        );
        setLastError('Voice connection is not active. Please reconnect.');
        return;
      }

      try {
        ws.send(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[IdealApp][AuraVoice] Failed to send binary data', error);
        setStatus('error');
        setLastError(
          'Failed to stream microphone audio. Please check your connection.',
        );
      }
    },
    [],
  );

  const reconnect = useCallback(() => {
    connect();
  }, [connect]);

  const disconnect = useCallback(() => {
    safeClose(1000, 'client_disconnect');
    setStatus('closed');
  }, [safeClose]);

  useEffect(() => {
    // Auto-connect on mount for voice-enabled experiences.
    connect();

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect]);

  return {
    status,
    lastError,
    send,
    sendBinary,
    reconnect,
    disconnect,
  };
}
