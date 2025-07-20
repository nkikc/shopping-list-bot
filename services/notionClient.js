const { Client } = require('@notionhq/client');

class NotionClient {
  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_API_KEY,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID;
  }

  /**
   * アイテムをNotionデータベースに追加
   * @param {string} itemName - アイテム名
   * @param {string} userId - SlackユーザーID
   * @returns {string} NotionページID
   */
  async addItem(itemName, userId) {
    try {
      const response = await this.client.pages.create({
        parent: {
          database_id: this.databaseId,
        },
        properties: {
          'アイテム名': {
            title: [
              {
                text: {
                  content: itemName,
                },
              },
            ],
          },
          'ステータス': {
            status: {
              name: '未着手',
            },
          },
          '登録者': {
            rich_text: [
              {
                text: {
                  content: userId,
                },
              },
            ],
          },
          '登録日': {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
      });

      return response.id;
    } catch (error) {
      console.error('Notionアイテム追加エラー:', error);
      throw new Error('アイテムの追加に失敗しました');
    }
  }

  /**
   * 未完了のアイテム一覧を取得
   * @returns {Array} 未完了アイテムの配列
   */
  async getIncompleteItems() {
    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'ステータス',
          status: {
            equals: '未着手',
          },
        },
        sorts: [
          {
            property: '登録日',
            direction: 'ascending',
          },
        ],
      });

      return response.results.map(page => ({
        id: page.id,
        name: page.properties['アイテム名'].title[0]?.plain_text || '無名アイテム',
        registrant: page.properties['登録者'].rich_text[0]?.plain_text || '不明',
        registeredAt: page.properties['登録日'].date?.start || '',
      }));
    } catch (error) {
      console.error('Notionアイテム取得エラー:', error);
      throw new Error('アイテムの取得に失敗しました');
    }
  }

  /**
   * アイテムを完了状態に変更
   * @param {string} pageId - NotionページID
   * @returns {string} 完了したアイテム名
   */
  async completeItem(pageId) {
    try {
      // まず現在のアイテム名を取得
      const page = await this.client.pages.retrieve({ page_id: pageId });
      const itemName = page.properties['アイテム名'].title[0]?.plain_text || '無名アイテム';

      // ステータスを完了に変更
      await this.client.pages.update({
        page_id: pageId,
        properties: {
          'ステータス': {
            status: {
              name: '完了',
            },
          },
          '完了日時': {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
      });

      return itemName;
    } catch (error) {
      console.error('Notionアイテム完了エラー:', error);
      throw new Error('アイテムの完了処理に失敗しました');
    }
  }

  /**
   * データベースの存在確認
   * @returns {boolean} データベースが存在するかどうか
   */
  async validateDatabase() {
    try {
      await this.client.databases.retrieve({
        database_id: this.databaseId,
      });
      return true;
    } catch (error) {
      console.error('Notionデータベース確認エラー:', error);
      return false;
    }
  }
}

module.exports = { NotionClient }; 