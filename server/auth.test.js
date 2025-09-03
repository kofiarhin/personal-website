/**
 * @jest-environment node
 */
process.env.JWT_SECRET = 'testsecret';
const request = require('supertest');
const app = require('./app');
const { resetUsers } = require('./routes/auth');

describe('auth routes', () => {
  beforeEach(() => {
    resetUsers();
  });

  test('registers a new user and returns token', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'alice', password: 'password123' });
    expect(res.status).toBe(201);
    expect(typeof res.body.token).toBe('string');
  });

  test('prevents duplicate registrations', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'bob', password: 'password123' });
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'bob', password: 'password123' });
    expect(res.status).toBe(409);
  });

  test('logs in an existing user', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'charlie', password: 'password123' });
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'charlie', password: 'password123' });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
  });

  test('rejects invalid credentials', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'dave', password: 'password123' });
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'dave', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  test('validates input', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: '', password: '123' });
    expect(res.status).toBe(400);
  });
});
