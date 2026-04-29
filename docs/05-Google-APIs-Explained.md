# Chapter 5: The "Google Services" Explained (Gemini & Translate)

Your hackathon score relies heavily on your use of **Google Services**. In VoteWise AI, we used two powerful Google APIs. This chapter explains exactly how we hooked them up to our backend.

---

## 1. The "Brain" (Gemini AI)

We wanted VoteWise AI to answer questions about elections smartly and safely. We used **Google Gemini 2.5 Flash**.

If you look in `server/services/geminiService.js`, you'll see this:

```javascript
// 1. IMPORTING THE GOOGLE TOOL
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 2. GIVING IT THE PASSWORD
// We pass our secret key from the .env file to the Google SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. THE "SYSTEM PROMPT"
// This is the most important part of the AI! 
// Before the user even asks a question, we give the AI a strict set of rules.
const SYSTEM_PROMPT = `You are VoteWise AI, an expert, non-partisan Indian election assistant.
Keep answers under 3 sentences. Be completely neutral. Do not mention political parties.`;

// 4. THE FUNCTION WE CALL FROM chatController.js
const generateAssistantResponse = async (userMessage) => {
  // We tell Google we want to use the 'gemini-2.5-flash' model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // We combine our strict rules with the user's question
  const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}`;

  // We ask Google to generate the text
  const result = await model.generateContent(prompt);
  
  // We grab the text out of the massive object Google sends back
  return result.response.text();
};
```

### Why "Flash"?
There are different models (like Gemini Pro). We used Gemini Flash because it is insanely fast and very cheap (which helps with the Efficiency score).

---

## 2. The Translator (Google Cloud Translation API)

India has many languages. We needed to be able to detect if a user asked a question in Bengali or Hindi, ask Gemini in English, and then translate the answer back into Bengali or Hindi.

If you look in `server/services/translationService.js`, you'll see this:

```javascript
// 1. IMPORTING THE GOOGLE TRANSLATE TOOL
const { Translate } = require('@google-cloud/translate/build/src/v2');

// 2. GIVING IT THE PASSWORD
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

// 3. THE FUNCTION WE CALL FROM chatController.js
const detectAndTranslate = async (originalUserMessage, englishAiResponse) => {
  // A. Detect the language
  // We send the user's message ("Aap kaise ho?") to Google, and it replies with "hi" (Hindi)
  let detectedLang = 'en';
  const [detections] = await translate.detect(originalUserMessage);
  
  if (detections && detections.language) {
    detectedLang = detections.language;
  }

  // B. Translate the AI's reply
  // If the user typed in English, we skip translating to save money and time!
  if (detectedLang === 'en') {
    return { translatedResponse: englishAiResponse, detectedLang: 'en' };
  }

  // If the user typed in Hindi, we tell Google to translate the English answer to Hindi
  const [translatedText] = await translate.translate(englishAiResponse, detectedLang);
  
  return { 
    translatedResponse: translatedText, 
    detectedLang 
  };
};
```

### Why we got 100% on Google Services
You received a perfect score for Google Services because:
1. You integrated **two** different Google Cloud APIs (Generative AI + Cloud Translate).
2. You implemented them safely (using `.env` variables).
3. You didn't just use them blindly; the translation only runs *if* the user types in a non-English language. The scoring robot loved this logical efficiency.

---

# Final Conclusion
You now have a complete, line-by-line understanding of your MERN stack application! 
* You know **React** paints the screen and uses `fetch` to talk to the backend.
* You know **Express** is the traffic cop that checks security (`helmet`), limits spam (`rateLimit`), and remembers old answers (`new Map()`).
* You know how to safely pass **Environment Variables** to a deployed server so hackers can't steal your Google API keys.

Be proud of this project, and keep coding!
