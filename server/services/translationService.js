const { Translate } = require('@google-cloud/translate').v2;

// Initialize Google Cloud Translation client with API key
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

// Supported Indian languages for the app (ISO 639-1 codes)
const SUPPORTED_LANGUAGES = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa'];

/**
 * Detects the language of the input text.
 * @param {string} text - The text to detect language for.
 * @returns {Promise<string>} ISO 639-1 language code (e.g. 'hi', 'en')
 */
const detectLanguage = async (text) => {
  try {
    if (!process.env.GOOGLE_TRANSLATE_API_KEY) return 'en';
    const [detection] = await translate.detect(text);
    return detection.language || 'en';
  } catch (err) {
    console.warn('Language detection failed, defaulting to English:', err.message);
    return 'en';
  }
};

/**
 * Translates text from one language to another.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - Target ISO 639-1 language code.
 * @returns {Promise<string>} Translated text (or original on failure).
 */
const translateText = async (text, targetLang) => {
  try {
    if (!process.env.GOOGLE_TRANSLATE_API_KEY) return text;
    if (targetLang === 'en') return text;
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (err) {
    console.warn('Translation failed, returning original response:', err.message);
    return text; // Graceful fallback — never break the chat
  }
};

/**
 * Detects the language of the user message, then translates
 * the AI response into that language if it's not English.
 * @param {string} userMessage - The original user message.
 * @param {string} aiResponse - The AI-generated English response.
 * @returns {Promise<{ translatedResponse: string, detectedLang: string }>}
 */
const detectAndTranslate = async (userMessage, aiResponse) => {
  const detectedLang = await detectLanguage(userMessage);
  const isSupported = SUPPORTED_LANGUAGES.includes(detectedLang);

  if (!isSupported || detectedLang === 'en') {
    return { translatedResponse: aiResponse, detectedLang: 'en' };
  }

  const translatedResponse = await translateText(aiResponse, detectedLang);
  return { translatedResponse, detectedLang };
};

module.exports = { detectLanguage, translateText, detectAndTranslate };
