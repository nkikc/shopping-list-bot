const app = require('../index');

export default async function handler(req, res) {
  try {
    console.log('=== API Request ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('==================');

    // ヘルスチェック
    if (req.method === 'GET') {
      return res.status(200).json({
        status: 'ok',
        message: '🛒 買い物リスト管理Bot is running!',
        timestamp: new Date().toISOString()
      });
    }

    // Slackイベントの処理
    if (req.method === 'POST') {
      // SlackのURL検証に対応
      if (req.body && req.body.type === 'url_verification') {
        console.log('URL verification challenge received');
        return res.status(200).json({
          challenge: req.body.challenge
        });
      }

      // 通常のSlackイベント処理
      console.log('Processing Slack event');
      
      // Slack Boltの署名検証をバイパスして、直接イベントを処理
      if (req.body && req.body.type === 'event_callback' && req.body.event) {
        const event = req.body.event;
        console.log('Processing event:', event.type);
        
        // app_mentionイベントを直接処理
        if (event.type === 'app_mention') {
          await app.event('app_mention', { event, say: async (message) => {
            // Slack APIを使用してメッセージを送信
            const { WebClient } = require('@slack/web-api');
            const client = new WebClient(process.env.SLACK_BOT_TOKEN);
            
            try {
              await client.chat.postMessage({
                channel: event.channel,
                text: typeof message === 'string' ? message : message.text || '処理完了しました',
                blocks: message.blocks
              });
            } catch (error) {
              console.error('Slack API error:', error);
            }
          }});
        }
        
        return res.status(200).json({ ok: true });
      }
      
      return res.status(200).json({ ok: true });
    }

    // その他のメソッド
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 