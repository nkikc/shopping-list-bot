# 🛒 買い物リスト管理Bot

SlackとNotionを連携した買い物リスト管理Botです。Slackでメンションするだけで、買い物アイテムをNotionに登録・管理できます。

## ✨ 機能

- **登録機能**: `@ShoppingBot 登録 アイテム1、アイテム2` で複数アイテムを一括登録
- **確認機能**: `@ShoppingBot 教えて` で未完了アイテムを表示
- **完了機能**: ボタン押下でアイテムを完了状態に変更
- **複数セパレータ対応**: `、`, `,`, `, `, `・`, `と`, `and`, `空白` でアイテムを分割

## 🚀 セットアップ手順

### 1. 必要なアカウント・API

- **Slack**: Slack Appを作成し、Bot Tokenを取得
- **Notion**: Notion API KeyとデータベースIDを取得

### 2. プロジェクトのセットアップ

```bash
# 依存関係をインストール
npm install

# 環境変数ファイルを作成
cp env.example .env
```

### 3. 環境変数の設定

`.env` ファイルを編集して、以下の値を設定してください：

```env
# Slack設定
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_TOKEN=xapp-your-app-token-here

# Notion設定
NOTION_API_KEY=secret-your-notion-api-key-here
NOTION_DATABASE_ID=your-database-id-here

# アプリケーション設定
PORT=3000
NODE_ENV=development
```

### 4. Notionデータベースの作成

以下のカラムを持つデータベースをNotionで作成してください：

| カラム名 | タイプ | 説明 |
|----------|--------|------|
| アイテム名 | テキスト | 買うものの名称 |
| ステータス | セレクト | 未完了 / 完了 |
| 登録者 | テキスト | Slackのユーザー名/ID |
| 登録日時 | Date | アイテム登録日時 |
| 完了日時 | Date | 完了ボタン押下時に記録 |

### 5. Slack Appの設定

1. [Slack API](https://api.slack.com/apps) で新しいAppを作成
2. 以下の権限を追加：
   - `app_mentions:read`
   - `chat:write`
   - `im:history`
   - `im:read`
   - `im:write`
3. Event Subscriptionsを有効化し、以下を追加：
   - `app_mention`
4. Interactivity & Shortcutsを有効化
5. Socket Modeを有効化

### 6. アプリケーションの起動

```bash
# 開発モードで起動
npm run dev

# 本番モードで起動
npm start
```

## 📝 使用方法

### アイテムの登録

```
@ShoppingBot 登録 牛乳、卵、パン
@ShoppingBot 登録 牛乳 卵 パン
@ShoppingBot 登録 牛乳・卵・パン
```

### アイテム一覧の表示

```
@ShoppingBot 教えて
@ShoppingBot 一覧
@ShoppingBot リスト
```

### アイテムの完了

表示されたアイテムの「✅ 完了」ボタンを押すと、該当アイテムが完了状態になります。

## 🧪 テスト

```bash
# テストを実行
npm test
```

## 📁 プロジェクト構造

```
shopping-list-bot/
├── index.js              # メインアプリケーションファイル
├── services/
│   ├── notionClient.js   # Notion API連携
│   ├── messageParser.js  # メッセージ解析
│   └── blockBuilder.js   # Slack Block Kit構築
├── package.json
├── env.example
└── README.md
```

## 🔧 開発

### 開発モード

```bash
npm run dev
```

### ログの確認

アプリケーションのログはコンソールに出力されます。エラーやデバッグ情報を確認できます。

## 🚨 トラブルシューティング

### よくある問題

1. **Notion APIエラー**
   - API Keyが正しく設定されているか確認
   - データベースIDが正しいか確認
   - データベースの権限設定を確認

2. **Slack Botエラー**
   - Bot Tokenが正しく設定されているか確認
   - 必要な権限が付与されているか確認
   - Event Subscriptionsが正しく設定されているか確認

3. **環境変数エラー**
   - `.env` ファイルが正しく作成されているか確認
   - すべての必須環境変数が設定されているか確認

## 📈 今後の拡張予定

- [ ] 完了の取り消し（Undo）機能
- [ ] アイテムのカテゴリ追加
- [ ] 定期通知機能
- [ ] 複数ユーザー対応
- [ ] LINE連携
- [ ] 音声入力連携

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！ 