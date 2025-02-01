import request from 'supertest';
import { app } from '../src/index.js';
import { db } from '../src/config/db.js';

let server;
let authToken;
let organizerToken;

beforeAll(() => {
  server = app.listen(3001);
});

beforeEach(async () => {
  db.users.clear();
  db.events.clear();
  db.eventRegistrations.clear();

  // Create test users
  const attendeeRes = await request(app)
    .post('/api/users/register')
    .send({
      email: 'attendee@example.com',
      password: 'password123',
      name: 'Test Attendee',
      role: 'attendee'
    });

  const organizerRes = await request(app)
    .post('/api/users/register')
    .send({
      email: 'organizer@example.com',
      password: 'password123',
      name: 'Test Organizer',
      role: 'organizer'
    });

  authToken = attendeeRes.body.token;
  organizerToken = organizerRes.body.token;
});

afterAll((done) => {
  server.close(done);
});

describe('Event Management', () => {
  const testEvent = {
    title: 'Test Event',
    description: 'Test Description',
    date: '2024-01-01',
    time: '14:00',
    capacity: 100
  };

  test('should create new event as organizer', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send(testEvent);

    expect(res.status).toBe(201);
    expect(res.body.event.title).toBe(testEvent.title);
  });

  test('should not create event as attendee', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testEvent);

    expect(res.status).toBe(403);
  });

  test('should register for event', async () => {
    // Create event
    const eventRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send(testEvent);

    // Register for event
    const res = await request(app)
      .post(`/api/events/${eventRes.body.event.id}/register`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.event.participants).toHaveLength(1);
  });
});