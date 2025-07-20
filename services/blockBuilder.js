class BlockBuilder {
  /**
   * アイテムリスト用のBlock Kitを構築
   * @param {Array} items - アイテムの配列
   * @returns {Array} Block Kitの配列
   */
  buildItemList(items) {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🛒 未完了のアイテム一覧',
          emoji: true
        }
      },
      {
        type: 'divider'
      }
    ];

    // アイテムが存在しない場合
    if (items.length === 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '📝 未完了のアイテムはありません。'
        }
      });
      return blocks;
    }

    // 各アイテムにボタンを付けて追加
    items.forEach((item, index) => {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: this.formatItemText(item, index + 1)
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '✅ 完了',
            emoji: true
          },
          value: item.id,
          action_id: 'complete_item',
          style: 'primary'
        }
      });
    });

    // フッター情報を追加
    blocks.push(
      {
        type: 'divider'
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `📊 合計 ${items.length} 件のアイテム`
          }
        ]
      }
    );

    return blocks;
  }

  /**
   * アイテムテキストをフォーマット
   * @param {Object} item - アイテムオブジェクト
   * @param {number} index - インデックス番号
   * @returns {string} フォーマットされたテキスト
   */
  formatItemText(item, index) {
    const registrant = item.registrant || '不明';
    const registeredAt = item.registeredAt ? this.formatDate(item.registeredAt) : '';
    
    let text = `*${index}. ${item.name}*`;
    
    if (registrant !== '不明') {
      text += `\n👤 登録者: ${registrant}`;
    }
    
    if (registeredAt) {
      text += `\n📅 登録日: ${registeredAt}`;
    }
    
    return text;
  }

  /**
   * 日付をフォーマット
   * @param {string} dateString - ISO日付文字列
   * @returns {string} フォーマットされた日付
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  }

  /**
   * 登録完了メッセージ用のBlock Kitを構築
   * @param {Array} items - 登録されたアイテムの配列
   * @returns {Array} Block Kitの配列
   */
  buildRegistrationMessage(items) {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🛒 アイテムを登録しました',
          emoji: true
        }
      },
      {
        type: 'divider'
      }
    ];

    // 登録されたアイテムをリスト表示
    items.forEach((item, index) => {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `• ${item}`
        }
      });
    });

    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `📝 合計 ${items.length} 件のアイテムを登録しました`
        }
      ]
    });

    return blocks;
  }

  /**
   * 完了メッセージ用のBlock Kitを構築
   * @param {string} itemName - 完了したアイテム名
   * @returns {Array} Block Kitの配列
   */
  buildCompletionMessage(itemName) {
    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `✅ *${itemName}* を完了しました！`
        }
      }
    ];
  }

  /**
   * エラーメッセージ用のBlock Kitを構築
   * @param {string} errorMessage - エラーメッセージ
   * @returns {Array} Block Kitの配列
   */
  buildErrorMessage(errorMessage) {
    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `❌ *エラーが発生しました*\n${errorMessage}`
        }
      }
    ];
  }

  /**
   * ヘルプメッセージ用のBlock Kitを構築
   * @returns {Array} Block Kitの配列
   */
  buildHelpMessage() {
    return [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🛒 買い物リスト管理Bot ヘルプ',
          emoji: true
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*📝 使用方法*\n\n' +
                '• `@ShoppingBot 登録 アイテム1、アイテム2` - アイテムを登録\n' +
                '• `@ShoppingBot 教えて` - 未完了アイテムを表示\n\n' +
                '*🔧 対応セパレータ*\n' +
                '`、`, `,`, `, `, `・`, `と`, `and`, `空白`\n\n' +
                '*💡 例*\n' +
                '• `@ShoppingBot 登録 牛乳、卵、パン`\n' +
                '• `@ShoppingBot 登録 牛乳 卵 パン`\n' +
                '• `@ShoppingBot 教えて`'
        }
      }
    ];
  }
}

module.exports = { BlockBuilder }; 