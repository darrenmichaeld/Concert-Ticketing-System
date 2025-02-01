import { Request, Response } from 'express';
import { strapiService } from '../services/strapiService';

export const ticketController = {
  getAllTickets: async (req: Request, res: Response) => {
    try {
      const tickets = await strapiService.get('tickets');
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tickets', error });
    }
  },

  getTicketById: async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.id;
      const ticket = await strapiService.getById('tickets', ticketId);
      res.json(ticket);
    } catch (error) {
      res.status(404).json({ message: 'Ticket not found', error });
    }
  },

  createTicket: async (req: Request, res: Response) => {
    try {
      const newTicket = await strapiService.post('tickets', req.body);
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(400).json({ message: 'Error creating ticket', error });
    }
  },

  createTicketFromSheet: async (data: any) => {
    try {
      const newTicket = await strapiService.post('tickets', data);
      console.log('Created new ticket:', newTicket);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  },

  updateTicket: async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.id;
      const updatedTicket = await strapiService.put('tickets', ticketId, req.body);
      res.json(updatedTicket);
    } catch (error) {
      res.status(404).json({ message: 'Error updating ticket', error });
    }
  },

  deleteTicket: async (req: Request, res: Response) => {
    try {
      const ticketId = req.params.id;
      const deletedTicket = await strapiService.delete('tickets', ticketId);
      res.json(deletedTicket);
    } catch (error) {
      res.status(404).json({ message: 'Error deleting ticket', error });
    }
  },

  deleteTicketFromSheet: async (data: any) => {
    try {
      const { deleteId } = data;
      const deletedEvent = await strapiService.delete('events', deleteId);
      console.log('Deleted event with id:', deleteId);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  },
};