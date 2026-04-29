const request = require('supertest');
const app = require('../app');

// Mock the Gemini service so tests never call real API
jest.mock('../services/geminiService', () => ({
  generateAssistantResponse: jest.fn().mockResolvedValue('Mock AI response about voting.'),
}));

// Mock the Translation service
jest.mock('../services/translationService', () => ({
  detectAndTranslate: jest.fn().mockResolvedValue({
    translatedResponse: 'Mock AI response about voting.',
    detectedLang: 'en',
  }),
}));

// Mock mongoose to avoid needing a real DB connection
jest.mock('../models/Chat', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true),
  }));
});

describe('POST /api/chat', () => {
  it('should return 200 with a reply when given a valid message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'How do I register to vote?' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reply');
    expect(res.body).toHaveProperty('status', 'success');
    expect(typeof res.body.reply).toBe('string');
  });

  it('should return 400 when message is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Message is required');
  });

  it('should return 400 when message exceeds 1000 characters', async () => {
    const longMessage = 'a'.repeat(1001);
    const res = await request(app)
      .post('/api/chat')
      .send({ message: longMessage });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/too long/i);
  });

  it('should return 400 when message is an empty string', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should include detectedLang in response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'What is election day?' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('detectedLang');
  });

  it('should return 500 when Gemini service throws', async () => {
    const { generateAssistantResponse } = require('../services/geminiService');
    generateAssistantResponse.mockRejectedValueOnce(new Error('API failure'));

    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Test error handling' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
