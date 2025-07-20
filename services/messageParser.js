class MessageParser {
  constructor() {
    // アイテム分割用のセパレータ
    this.separators = ['、', ',', ', ', '・', 'と', 'and', ' '];
  }

  /**
   * Slackメッセージからコマンドを解析
   * @param {string} message - Slackメッセージ
   * @returns {Object} 解析結果 {type: 'register'|'list'|'unknown', items: Array}
   */
  parseCommand(message) {
    // Bot名を除去
    const cleanMessage = this.removeBotMention(message);
    
    // コマンドを判定
    if (this.isRegisterCommand(cleanMessage)) {
      return {
        type: 'register',
        items: this.extractItems(cleanMessage)
      };
    } else if (this.isListCommand(cleanMessage)) {
      return {
        type: 'list',
        items: []
      };
    } else {
      return {
        type: 'unknown',
        items: []
      };
    }
  }

  /**
   * Botメンションを除去
   * @param {string} message - 元のメッセージ
   * @returns {string} Botメンションを除去したメッセージ
   */
  removeBotMention(message) {
    // <@BOT_ID> 形式のメンションを除去
    return message.replace(/<@[A-Z0-9]+>/g, '').trim();
  }

  /**
   * 登録コマンドかどうかを判定
   * @param {string} message - メッセージ
   * @returns {boolean} 登録コマンドかどうか
   */
  isRegisterCommand(message) {
    const registerKeywords = ['登録', '追加', 'add', 'register'];
    const lowerMessage = message.toLowerCase();
    
    return registerKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
  }

  /**
   * リスト表示コマンドかどうかを判定
   * @param {string} message - メッセージ
   * @returns {boolean} リスト表示コマンドかどうか
   */
  isListCommand(message) {
    const listKeywords = ['教えて', '一覧', 'リスト', 'list', 'show', '表示'];
    const lowerMessage = message.toLowerCase();
    
    return listKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
  }

  /**
   * メッセージからアイテムを抽出
   * @param {string} message - メッセージ
   * @returns {Array} アイテムの配列
   */
  extractItems(message) {
    // 登録キーワードを除去
    const cleanMessage = this.removeCommandKeywords(message);
    
    if (!cleanMessage.trim()) {
      return [];
    }

    // セパレータで分割
    let items = [cleanMessage];
    
    for (const separator of this.separators) {
      const newItems = [];
      for (const item of items) {
        newItems.push(...item.split(separator));
      }
      items = newItems;
    }

    // 空文字と空白を除去して返す
    return items
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  /**
   * コマンドキーワードを除去
   * @param {string} message - メッセージ
   * @returns {string} コマンドキーワードを除去したメッセージ
   */
  removeCommandKeywords(message) {
    const registerKeywords = ['登録', '追加', 'add', 'register'];
    let cleanMessage = message;

    for (const keyword of registerKeywords) {
      const regex = new RegExp(keyword, 'gi');
      cleanMessage = cleanMessage.replace(regex, '');
    }

    return cleanMessage.trim();
  }

  /**
   * アイテム名を正規化（前後の空白除去、重複除去など）
   * @param {string} itemName - アイテム名
   * @returns {string} 正規化されたアイテム名
   */
  normalizeItemName(itemName) {
    return itemName.trim();
  }

  /**
   * アイテムリストを正規化
   * @param {Array} items - アイテムの配列
   * @returns {Array} 正規化されたアイテムの配列
   */
  normalizeItems(items) {
    const normalized = items.map(item => this.normalizeItemName(item));
    // 重複を除去
    return [...new Set(normalized)];
  }
}

module.exports = { MessageParser }; 