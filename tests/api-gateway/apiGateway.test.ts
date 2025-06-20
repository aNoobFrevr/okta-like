import request from 'supertest';
import app from '../../src/api-gateway/index';

describe('API Gateway', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
