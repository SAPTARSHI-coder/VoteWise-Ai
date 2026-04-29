const { generateAssistantResponse } = require('../services/geminiService');

// Mock the @google/genai package
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: 'Here is information about voter registration in India.',
      }),
    },
  })),
}));

describe('geminiService.generateAssistantResponse', () => {
  const originalKey = process.env.GEMINI_API_KEY;

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalKey;
    jest.clearAllMocks();
  });

  it('should return a fallback message when API key is missing', async () => {
    process.env.GEMINI_API_KEY = '';
    const result = await generateAssistantResponse('How do I vote?');
    expect(result).toMatch(/VoteWise AI/i);
    expect(result).toMatch(/API key/i);
  });

  it('should return a fallback when API key is the placeholder', async () => {
    process.env.GEMINI_API_KEY = 'your_gemini_api_key_here';
    const result = await generateAssistantResponse('How do I vote?');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should call generateContent with the correct model', async () => {
    process.env.GEMINI_API_KEY = 'valid-test-key';
    const { GoogleGenAI } = require('@google/genai');

    await generateAssistantResponse('What is the EVM machine?');

    const instance = GoogleGenAI.mock.results[0].value;
    expect(instance.models.generateContent).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-2.5-flash' })
    );
  });

  it('should return the text from the AI response', async () => {
    process.env.GEMINI_API_KEY = 'valid-test-key';
    const result = await generateAssistantResponse('Explain the election process');
    expect(result).toBe('Here is information about voter registration in India.');
  });

  it('should throw an error when the API call fails', async () => {
    process.env.GEMINI_API_KEY = 'valid-test-key';
    const { GoogleGenAI } = require('@google/genai');
    const instance = new GoogleGenAI();
    instance.models.generateContent.mockRejectedValueOnce(new Error('Network error'));

    // Re-mock to use the failing instance
    GoogleGenAI.mockImplementationOnce(() => ({
      models: {
        generateContent: jest.fn().mockRejectedValueOnce(new Error('Network error')),
      },
    }));

    await expect(generateAssistantResponse('test')).rejects.toThrow('Failed to generate AI response.');
  });
});
