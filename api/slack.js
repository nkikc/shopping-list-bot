const app = require('../index-vercel');

export default async function handler(req, res) {
  try {
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
      await app.receiver.requestListener(req, res);
      return;
    }

    // その他のメソッド
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 