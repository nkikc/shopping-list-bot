// テスト環境のセットアップ
require('dotenv').config({ path: '.env.test' });

// テスト用の環境変数が設定されていない場合のデフォルト値
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.NOTION_API_KEY = process.env.NOTION_API_KEY || 'test-api-key';
process.env.NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || 'test-database-id';
process.env.SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || 'test-bot-token';
process.env.SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || 'test-signing-secret';
process.env.SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN || 'test-app-token'; 