# Virtual Event Management System

A Node.js backend system for managing virtual events, featuring user authentication, event management, and participant registration.

## Features

- User Authentication (JWT)
- Event Management (CRUD operations)
- Participant Registration
- Email Notifications
- Role-based Authorization
- In-memory Data Storage

## API Endpoints

### Authentication
- POST /api/users/register - Register new user
- POST /api/users/login - User login

### Events
- GET /api/events - Get all events
- POST /api/events - Create new event (Organizer only)
- PUT /api/events/:id - Update event (Organizer only)
- DELETE /api/events/:id - Delete event (Organizer only)
- POST /api/events/:id/register - Register for an event

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env`

3. Start the server:
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

## Testing

Run tests:
```bash
npm test
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Input validation
- Error handling middleware

## Data Structure

The system uses in-memory storage with the following structure:

- Users Map: Stores user information
- Events Map: Stores event details
- EventRegistrations Map: Manages event participants

## Error Handling

- Comprehensive error handling middleware
- Winston logger for error tracking
- Validation using express-validator

## Email Notifications

The system sends emails for:
- User registration
- Event registration confirmation

## Author

Ganesh Mandpe

## License

MIT
