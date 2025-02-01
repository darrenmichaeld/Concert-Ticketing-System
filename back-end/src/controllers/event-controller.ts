import { Request, Response } from 'express';
import { strapiService } from '../services/strapiService';

export const eventController = {
  getAllEvents: async (req: Request, res: Response) => {
    try {
      const events = await strapiService.get('events');
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }
  },

  getEventById: async (req: Request, res: Response) => {
    try {
      const eventId = req.params.id;
      const event = await strapiService.getById('events', eventId);
      res.json(event);
    } catch (error) {
      res.status(404).json({ message: 'Event not found', error });
    }
  },

  createEvent: async (req: Request, res: Response) => {
    try {
      const newEvent = await strapiService.post('events', req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(400).json({ message: 'Error creating event', error });
    }
  },

  createEventFromSheet: async (data: any) => {
    try {
      const newEvent = await strapiService.post('events', data);
      console.log('Created new event:', newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  },

  updateEvent: async (req: Request, res: Response) => {
    try {
      const eventId = req.params.id;
      const updatedEvent = await strapiService.put('events', eventId, req.body);
      res.json(updatedEvent);
    } catch (error) {
      res.status(404).json({ message: 'Error updating event', error });
    }
  },

  deleteEvent: async (req: Request, res: Response) => {
    try {
      const eventId = req.params.id;
      const deletedEvent = await strapiService.delete('events', eventId);
      res.json(deletedEvent);
    } catch (error) {
      res.status(404).json({ message: 'Error deleting event', error });
    }
  }
};