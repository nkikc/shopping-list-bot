require('dotenv').config();
const { App } = require('@slack/bolt');
const { NotionClient } = require('./services/notionClient');
const { MessageParser } = require('./services/messageParser');
const { BlockBuilder } = require('./services/blockBuilder');

// Slackアプリの初期化（Vercel用）
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true,
});

// Notionクライアントの初期化
const notionClient = new NotionClient();
const messageParser = new MessageParser();
const blockBuilder = new BlockBuilder();

// メンションイベントのハンドラー
app.event('app_mention', async ({ event, say }) => {
  try {
    console.log('=== メンションイベント受信 ===');
    console.log('メッセージテキスト:', event.text);
    console.log('ユーザーID:', event.user);
    console.log('チャンネルID:', event.channel);
    console.log('========================');
    
    const command = messageParser.parseCommand(event.text);
    console.log('解析結果:', command);
    
    if (command.type === 'register') {
      console.log('登録処理を開始');
      await handleRegister(command.items, event.user, say);
    } else if (command.type === 'list') {
      console.log('リスト表示処理を開始');
      await handleList(say);
    } else {
      console.log('不明なコマンド、ヘルプを表示');
      await say('使用方法:\n• `@ShoppingBot 登録 アイテム1、アイテム2` - アイテムを登録\n• `@ShoppingBot 教えて` - 未完了アイテムを表示');
    }
  } catch (error) {
    console.error('メンション処理エラー:', error);
    await say('エラーが発生しました。もう一度お試しください。');
  }
});

// インタラクティブコンポーネントのハンドラー（ボタン押下など）
app.action('complete_item', async ({ ack, body, say }) => {
  await ack();
  
  try {
    const notionId = body.actions[0].value;
    const itemName = await notionClient.completeItem(notionId);
    
    await say(`✅ 完了しました: ${itemName}`);
  } catch (error) {
    console.error('完了処理エラー:', error);
    await say('完了処理でエラーが発生しました。');
  }
});

// 登録処理
async function handleRegister(items, userId, say) {
  try {
    const registeredItems = [];
    
    for (const item of items) {
      const notionId = await notionClient.addItem(item, userId);
      registeredItems.push(item);
    }
    
    const message = `🛒 登録しました:\n${registeredItems.map(item => `• ${item}`).join('\n')}`;
    await say(message);
  } catch (error) {
    console.error('登録処理エラー:', error);
    await say('登録処理でエラーが発生しました。');
  }
}

// リスト表示処理
async function handleList(say) {
  try {
    const items = await notionClient.getIncompleteItems();
    
    if (items.length === 0) {
      await say('📝 未完了のアイテムはありません。');
      return;
    }
    
    const blocks = blockBuilder.buildItemList(items);
    await say({
      text: '🛒 未完了のアイテム一覧',
      blocks: blocks
    });
  } catch (error) {
    console.error('リスト表示エラー:', error);
    await say('リスト表示でエラーが発生しました。');
  }
}

// エラーハンドリング
app.error((error) => {
  console.error('Slackアプリエラー:', error);
});

// Vercel用のエクスポート
module.exports = app; 