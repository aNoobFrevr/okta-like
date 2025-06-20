import request from 'supertest';
import app from '../../src/users/index';

describe('Users Service', () => {
  it('should return empty users array', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
