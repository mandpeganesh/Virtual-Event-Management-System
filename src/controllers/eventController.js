import { db } from '../config/db.js';
import { logger } from '../utils/logger.js';
import { sendEventRegistrationEmail } from '../utils/emailService.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, capacity } = req.body;
    const organizerId = req.user.userId;

    const eventId = crypto.randomUUID();
    const event = {
      id: eventId,
      title,
      description,
      date,
      time,
      capacity,
      organizerId,
      participants: new Set(),
      createdAt: new Date()
    };

    db.events.set(eventId, event);
    db.eventRegistrations.set(eventId, new Set());

    res.status(201).json({
      message: 'Event created successfully',
      event: {
        ...event,
        participants: Array.from(event.participants)
      }
    });
  } catch (error) {
    logger.error('Event creation error:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, capacity } = req.body;
    const organizerId = req.user.userId;

    const event = db.events.get(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId !== organizerId) {
      return res.status(403).json({ message: 'Unauthorized to update this event' });
    }

    const updatedEvent = {
      ...event,
      title: title || event.title,
      description: description || event.description,
      date: date || event.date,
      time: time || event.time,
      capacity: capacity || event.capacity,
      updatedAt: new Date()
    };

    db.events.set(id, updatedEvent);

    res.json({
      message: 'Event updated successfully',
      event: {
        ...updatedEvent,
        participants: Array.from(updatedEvent.participants)
      }
    });
  } catch (error) {
    logger.error('Event update error:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.userId;

    const event = db.events.get(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = db.eventRegistrations.get(eventId);
    if (registrations.size >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    if (registrations.has(userId)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    registrations.add(userId);
    event.participants.add(userId);

    const user = db.users.get(userId);
    await sendEventRegistrationEmail(user.email, event.title);

    res.json({
      message: 'Successfully registered for event',
      event: {
        ...event,
        participants: Array.from(event.participants)
      }
    });
  } catch (error) {
    logger.error('Event registration error:', error);
    res.status(500).json({ message: 'Error registering for event' });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = Array.from(db.events.values()).map(event => ({
      ...event,
      participants: Array.from(event.participants)
    }));

    res.json({ events });
  } catch (error) {
    logger.error('Get events error:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerId = req.user.userId;

    const event = db.events.get(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId !== organizerId) {
      return res.status(403).json({ message: 'Unauthorized to delete this event' });
    }

    db.events.delete(id);
    db.eventRegistrations.delete(id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    logger.error('Event deletion error:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};