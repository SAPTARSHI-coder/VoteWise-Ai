const request = require('supertest');
const app = require('../app');

describe('GET /api/health', () => {
  it('should return 200 with success status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('VoteWise API is running!');
  });

  it('should return JSON content-type', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-type']).toMatch(/json/);
  });
});
