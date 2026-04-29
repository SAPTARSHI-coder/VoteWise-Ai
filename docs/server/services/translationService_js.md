# Masterclass: `server/services/translationService.js`

## Purpose of this File
This file is the specific module that handles language detection and translation using the Google Cloud Translation API. Its goal is to allow users to ask questions in Hindi, Bengali, Tamil, etc., and get answers back in their native language, even though the Gemini AI was prompted to generate answers in English for maximum accuracy.

---

## The Code & Line-by-Line Breakdown

```javascript
const { Translate } = require('@google-cloud/translate').v2;
```
* We import the official Google Cloud Translation SDK (v2).

```javascript
// Initialize Google Cloud Translation client with API key
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });
```
* We initialize the `Translate` object using our API key from the `.env` file. This is what allows us to authenticate and use the service.

```javascript
// Supported Indian languages for the app (ISO 639-1 codes)
const SUPPORTED_LANGUAGES = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa'];
```
* **Efficiency Win:** We hardcode an array of the major Indian languages we want to support. If a user types in Spanish or Russian, we won't waste API credits translating it; we will just default to English.

```javascript
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
```
* **`detectLanguage`**: A helper function that takes the user's input and asks Google to guess what language it is.
* **Fallback Strategy:** Notice the `try/catch`. If the API key is missing or the translation service crashes, we *don't* crash the app. We just return `'en'` (English). This guarantees the chat keeps working.

```javascript
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
```
* **`translateText`**: Takes the English AI response and translates it into the user's native language.
* **Optimization:** `if (targetLang === 'en') return text;` If the user is already speaking English, we skip the translation API call completely to save money and time!

```javascript
const detectAndTranslate = async (userMessage, aiResponse) => {
  const detectedLang = await detectLanguage(userMessage);
  const isSupported = SUPPORTED_LANGUAGES.includes(detectedLang);

  if (!isSupported || detectedLang === 'en') {
    return { translatedResponse: aiResponse, detectedLang: 'en' };
  }

  const translatedResponse = await translateText(aiResponse, detectedLang);
  return { translatedResponse, detectedLang };
};
```
* **`detectAndTranslate`**: This is the main function that gets exported and used by `chatController.js`. It chains the two helper functions together.
* First, it detects the language of the user's message.
* Then, it checks if that language is in our `SUPPORTED_LANGUAGES` array.
* If it is supported (and not English), it translates the AI's response into that language.
* It returns an object containing the final translated text and the detected language code.

```javascript
module.exports = { detectLanguage, translateText, detectAndTranslate };
```
* Exports the functions so they can be imported elsewhere in the server.
