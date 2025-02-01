import request from 'supertest';
import { app } from '../src/index.js';
import { db } from '../src/config/db.js';

let server;

beforeAll(() => {
  server = app.listen(3001);
});

beforeEach(() => {
  db.users.clear();
  db.events.clear();
  db.eventRegistrations.clear();
});

afterAll((done) => {
  server.close(done);
});

describe('User Authentication', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'attendee'
  };

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
  }, 10000);

  test('should login existing user', async () => {
    await request(app)
      .post('/api/users/register')
      .send(testUser);

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});