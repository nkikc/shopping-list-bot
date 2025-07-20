const { MessageParser } = require('../services/messageParser');

describe('MessageParser', () => {
  let parser;

  beforeEach(() => {
    parser = new MessageParser();
  });

  describe('parseCommand', () => {
    test('登録コマンドを正しく解析する', () => {
      const message = '<@BOT123> 登録 牛乳、卵、パン';
      const result = parser.parseCommand(message);
      
      expect(result.type).toBe('register');
      expect(result.items).toEqual(['牛乳', '卵', 'パン']);
    });

    test('リスト表示コマンドを正しく解析する', () => {
      const message = '<@BOT123> 教えて';
      const result = parser.parseCommand(message);
      
      expect(result.type).toBe('list');
      expect(result.items).toEqual([]);
    });

    test('不明なコマンドを正しく解析する', () => {
      const message = '<@BOT123> こんにちは';
      const result = parser.parseCommand(message);
      
      expect(result.type).toBe('unknown');
      expect(result.items).toEqual([]);
    });

    test('複数のセパレータを正しく処理する', () => {
      const message = '<@BOT123> 登録 牛乳 卵、パン・石鹸';
      const result = parser.parseCommand(message);
      
      expect(result.type).toBe('register');
      expect(result.items).toEqual(['牛乳', '卵', 'パン', '石鹸']);
    });
  });

  describe('removeBotMention', () => {
    test('Botメンションを正しく除去する', () => {
      const message = '<@BOT123> 登録 牛乳';
      const result = parser.removeBotMention(message);
      
      expect(result).toBe('登録 牛乳');
    });

    test('Botメンションがない場合はそのまま返す', () => {
      const message = '登録 牛乳';
      const result = parser.removeBotMention(message);
      
      expect(result).toBe('登録 牛乳');
    });
  });

  describe('isRegisterCommand', () => {
    test('登録キーワードを正しく認識する', () => {
      expect(parser.isRegisterCommand('登録 牛乳')).toBe(true);
      expect(parser.isRegisterCommand('追加 卵')).toBe(true);
      expect(parser.isRegisterCommand('add パン')).toBe(true);
      expect(parser.isRegisterCommand('register 石鹸')).toBe(true);
    });

    test('登録キーワードでない場合はfalseを返す', () => {
      expect(parser.isRegisterCommand('教えて')).toBe(false);
      expect(parser.isRegisterCommand('こんにちは')).toBe(false);
    });
  });

  describe('isListCommand', () => {
    test('リスト表示キーワードを正しく認識する', () => {
      expect(parser.isListCommand('教えて')).toBe(true);
      expect(parser.isListCommand('一覧')).toBe(true);
      expect(parser.isListCommand('リスト')).toBe(true);
      expect(parser.isListCommand('list')).toBe(true);
      expect(parser.isListCommand('show')).toBe(true);
      expect(parser.isListCommand('表示')).toBe(true);
    });

    test('リスト表示キーワードでない場合はfalseを返す', () => {
      expect(parser.isListCommand('登録 牛乳')).toBe(false);
      expect(parser.isListCommand('こんにちは')).toBe(false);
    });
  });

  describe('extractItems', () => {
    test('アイテムを正しく抽出する', () => {
      const message = '登録 牛乳、卵、パン';
      const result = parser.extractItems(message);
      
      expect(result).toEqual(['牛乳', '卵', 'パン']);
    });

    test('空のメッセージの場合は空配列を返す', () => {
      const message = '登録';
      const result = parser.extractItems(message);
      
      expect(result).toEqual([]);
    });

    test('複数のセパレータを正しく処理する', () => {
      const message = '登録 牛乳 卵、パン・石鹸';
      const result = parser.extractItems(message);
      
      expect(result).toEqual(['牛乳', '卵', 'パン', '石鹸']);
    });
  });

  describe('normalizeItems', () => {
    test('アイテムを正規化する', () => {
      const items = [' 牛乳 ', '卵', ' パン '];
      const result = parser.normalizeItems(items);
      
      expect(result).toEqual(['牛乳', '卵', 'パン']);
    });

    test('重複を除去する', () => {
      const items = ['牛乳', '卵', '牛乳', 'パン'];
      const result = parser.normalizeItems(items);
      
      expect(result).toEqual(['牛乳', '卵', 'パン']);
    });
  });
}); 