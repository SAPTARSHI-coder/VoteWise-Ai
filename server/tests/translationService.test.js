// Mock @google-cloud/translate before requiring the service
jest.mock('@google-cloud/translate', () => ({
  v2: {
    Translate: jest.fn().mockImplementation(() => ({
      detect: jest.fn().mockResolvedValue([{ language: 'hi', confidence: 0.98 }]),
      translate: jest.fn().mockResolvedValue(['मतदान के बारे में जानकारी।']),
    })),
  },
}));

const { detectLanguage, translateText, detectAndTranslate } = require('../services/translationService');

describe('translationService', () => {
  const originalKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  afterEach(() => {
    process.env.GOOGLE_TRANSLATE_API_KEY = originalKey;
  });

  describe('detectLanguage', () => {
    it('should return "en" when API key is not set', async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = '';
      const lang = await detectLanguage('Hello, how do I vote?');
      expect(lang).toBe('en');
    });

    it('should detect language from text when key is present', async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = 'test-key';
      const lang = await detectLanguage('मैं कैसे वोट करूं?');
      expect(lang).toBe('hi');
    });
  });

  describe('translateText', () => {
    it('should return original text when target is English', async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = 'test-key';
      const result = await translateText('How do I vote?', 'en');
      expect(result).toBe('How do I vote?');
    });

    it('should return original text when API key is missing', async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = '';
      const result = await translateText('How do I vote?', 'hi');
      expect(result).toBe('How do I vote?');
    });

    it('should return translated text for non-English target', async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = 'test-key';
      const result = await translateText('Information about voting.', 'hi');
      expect(result).toBe('मतदान के बारे में जानकारी।');
    });
  });

  describe('detectAndTranslate', () => {
    it('should return original response for English messages', async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = '';
      const { translatedResponse, detectedLang } = await detectAndTranslate(
        'How do I register?',
        'You can register at voters.eci.gov.in'
      );
      expect(detectedLang).toBe('en');
      expect(translatedResponse).toBe('You can register at voters.eci.gov.in');
    });

    it('should return translated response for Hindi messages', async () => {
      process.env.GOOGLE_TRANSLATE_API_KEY = 'test-key';
      const { translatedResponse, detectedLang } = await detectAndTranslate(
        'मैं कैसे वोट करूं?',
        'You can vote at your designated polling booth.'
      );
      expect(detectedLang).toBe('hi');
      expect(typeof translatedResponse).toBe('string');
    });
  });
});
