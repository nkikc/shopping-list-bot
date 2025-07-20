const { NotionClient } = require('../services/notionClient');
const { MessageParser } = require('../services/messageParser');
const { BlockBuilder } = require('../services/blockBuilder');
const { WebClient } = require('@slack/web-api');

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

      // インタラクティブコンポーネントの処理（ボタン押下など）
      if (req.body && (req.body.type === 'interactive_message' || req.body.type === 'block_actions' || req.body.payload)) {
        console.log('=== インタラクティブコンポーネント受信 ===');
        console.log('ペイロード:', JSON.stringify(req.body, null, 2));
        console.log('========================');
        
        // URLエンコードされたペイロードを解析
        let payload;
        if (req.body.payload) {
          try {
            payload = JSON.parse(req.body.payload);
            console.log('解析されたペイロード:', JSON.stringify(payload, null, 2));
          } catch (error) {
            console.error('ペイロード解析エラー:', error);
            return res.status(400).json({ error: 'Invalid payload' });
          }
        } else {
          payload = req.body;
        }
        
        const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
        
        try {
          // 完了ボタンの処理
          if (payload.actions && payload.actions[0].action_id === 'complete_item') {
            const notionId = payload.actions[0].value;
            const channelId = payload.channel.id;
            const notionClient = new NotionClient();
            
            console.log('完了ボタン押下:', notionId);
            
            const itemName = await notionClient.completeItem(notionId);
            
            await slackClient.chat.postMessage({
              channel: channelId,
              text: `✅ 完了しました: ${itemName}`
            });
          }
        } catch (error) {
          console.error('インタラクティブコンポーネント処理エラー:', error);
          await slackClient.chat.postMessage({
            channel: payload.channel.id,
            text: '完了処理でエラーが発生しました。'
          });
        }
        
        return res.status(200).json({ ok: true });
      }
      
      // 通常のSlackイベント処理
      console.log('Processing Slack event');
      
      // Slack Boltの署名検証をバイパスして、直接イベントを処理
      if (req.body && req.body.type === 'event_callback' && req.body.event) {
        const event = req.body.event;
        console.log('Processing event:', event.type);
        
        // app_mentionイベントを直接処理
        if (event.type === 'app_mention') {
          console.log('=== メンションイベント受信 ===');
          console.log('メッセージテキスト:', event.text);
          console.log('ユーザーID:', event.user);
          console.log('チャンネルID:', event.channel);
          console.log('========================');
          
          // サービスを初期化
          const notionClient = new NotionClient();
          const messageParser = new MessageParser();
          const blockBuilder = new BlockBuilder();
          const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
          
          try {
            const command = messageParser.parseCommand(event.text);
            console.log('解析結果:', command);
            
            if (command.type === 'register') {
              console.log('登録処理を開始');
              await handleRegister(command.items, event.user, event.channel, slackClient);
            } else if (command.type === 'list') {
              console.log('リスト表示処理を開始');
              await handleList(event.channel, slackClient, notionClient, blockBuilder);
            } else {
              console.log('不明なコマンド、ヘルプを表示');
              await slackClient.chat.postMessage({
                channel: event.channel,
                text: '使用方法:\n• `@ShoppingBot 登録 アイテム1、アイテム2` - アイテムを登録\n• `@ShoppingBot 教えて` - 未完了アイテムを表示'
              });
            }
          } catch (error) {
            console.error('メンション処理エラー:', error);
            await slackClient.chat.postMessage({
              channel: event.channel,
              text: 'エラーが発生しました。もう一度お試しください。'
            });
          }
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

// 登録処理
async function handleRegister(items, userId, channelId, slackClient) {
  try {
    const notionClient = new NotionClient();
    const registeredItems = [];
    
    for (const item of items) {
      const notionId = await notionClient.addItem(item, userId);
      registeredItems.push(item);
    }
    
    const message = `🛒 登録しました:\n${registeredItems.map(item => `• ${item}`).join('\n')}`;
    await slackClient.chat.postMessage({
      channel: channelId,
      text: message
    });
  } catch (error) {
    console.error('登録処理エラー:', error);
    await slackClient.chat.postMessage({
      channel: channelId,
      text: '登録処理でエラーが発生しました。'
    });
  }
}

// リスト表示処理
async function handleList(channelId, slackClient, notionClient, blockBuilder) {
  try {
    const items = await notionClient.getIncompleteItems();
    
    if (items.length === 0) {
      await slackClient.chat.postMessage({
        channel: channelId,
        text: '📝 未完了のアイテムはありません。'
      });
      return;
    }
    
    const blocks = blockBuilder.buildItemList(items);
    await slackClient.chat.postMessage({
      channel: channelId,
      text: '🛒 未完了のアイテム一覧',
      blocks: blocks
    });
  } catch (error) {
    console.error('リスト表示エラー:', error);
    await slackClient.chat.postMessage({
      channel: channelId,
      text: 'リスト表示でエラーが発生しました。'
    });
  }
} 