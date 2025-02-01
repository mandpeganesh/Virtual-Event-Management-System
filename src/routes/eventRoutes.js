import express from 'express';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  registerForEvent
} from '../controllers/eventController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateEvent } from '../utils/validators.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getEvents);
router.post('/', authorize(['organizer']), validateEvent, createEvent);
router.put('/:id', authorize(['organizer']), validateEvent, updateEvent);
router.delete('/:id', authorize(['organizer']), deleteEvent);
router.post('/:id/register', registerForEvent);

export { router as eventRouter };