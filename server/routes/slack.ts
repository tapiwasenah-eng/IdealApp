import express from 'express';

const router = express.Router();

router.post('/notify', async (req, res) => {
  try {
    const { message, viewerData } = req.body;
    
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!slackWebhookUrl) {
      console.warn('SLACK_WEBHOOK_URL is not set. Mocking Slack notification.');
      console.log(`[Mock Slack Notification] ${message}`, viewerData);
      return res.status(200).json({ success: true, mocked: true });
    }

    const payload = {
      text: message,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${message}*`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Viewer Details:*\n\`\`\`\${JSON.stringify(viewerData, null, 2)}\`\`\``
          }
        }
      ]
    };

    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    res.status(500).json({ success: false, error: 'Failed to send Slack notification' });
  }
});

export default router;
