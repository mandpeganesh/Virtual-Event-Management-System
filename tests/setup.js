import { jest } from '@jest/globals';

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';

jest.mock('../src/utils/emailService.js', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendEventRegistrationEmail: jest.fn().mockResolvedValue(true)
}));