import request from 'supertest';
import app from '../../index';

describe('Health Check Endpoint', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('healthy');
  });
});
