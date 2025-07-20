# 🚀 Vercelでのデプロイ手順

## 📋 前提条件

- [Vercel](https://vercel.com) アカウント
- GitHubリポジトリ（推奨）
- Slack App設定完了
- Notion API設定完了

## 🔧 デプロイ手順

### 1. プロジェクトをGitHubにプッシュ

```bash
# Gitリポジトリを初期化
git init
git add .
git commit -m "Initial commit: Shopping List Bot"

# GitHubにプッシュ
git remote add origin https://github.com/yourusername/shopping-list-bot.git
git push -u origin main
```

### 2. Vercelでプロジェクトをインポート

1. [Vercel](https://vercel.com) にログイン
2. **New Project** をクリック
3. GitHubリポジトリを選択
4. **Import** をクリック

### 3. 環境変数を設定

Vercelのプロジェクト設定で以下の環境変数を追加：

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
NOTION_API_KEY=your-notion-api-key
NOTION_DATABASE_ID=your-database-id
NODE_ENV=production
```

### 4. デプロイ設定

- **Framework Preset**: Other
- **Build Command**: `npm run vercel-build`
- **Output Directory**: 空欄
- **Install Command**: `npm install`

### 5. デプロイ実行

**Deploy** ボタンをクリックしてデプロイを開始

## 🌐 デプロイ後の設定

### Slack Appの設定更新

1. [Slack API](https://api.slack.com/apps) でアプリを開く
2. **Event Subscriptions** で以下を設定：
   - **Request URL**: `https://your-app.vercel.app/slack/events`
3. **Interactivity & Shortcuts** で以下を設定：
   - **Request URL**: `https://your-app.vercel.app/slack/events`

### 動作確認

1. Slackでメンションを送信：
   ```
   @ShoppingBot 登録 牛乳、卵
   ```

2. Vercelのダッシュボードでログを確認

## 📊 監視・メンテナンス

### ログの確認
- Vercelダッシュボード → Functions → ログを確認

### 環境変数の更新
- Vercelダッシュボード → Settings → Environment Variables

### 再デプロイ
- GitHubにプッシュすると自動で再デプロイ

## 🔒 セキュリティ

- 環境変数はVercelで安全に管理
- HTTPS自動対応
- グローバルCDNで高速アクセス

## 💰 料金

- **Hobby Plan**: 無料（月100GB-Hours）
- **Pro Plan**: $20/月（月1000GB-Hours）

## 🚨 トラブルシューティング

### よくある問題

1. **環境変数が設定されていない**
   - Vercelダッシュボードで環境変数を確認

2. **Slackイベントが受信されない**
   - Request URLが正しく設定されているか確認

3. **Notion APIエラー**
   - API KeyとDatabase IDを確認

### ログの確認方法

```bash
# Vercel CLIでログを確認
vercel logs your-app-name
```

## 🎉 完了

デプロイが完了すると、24時間稼働する買い物リスト管理Botが完成します！ 