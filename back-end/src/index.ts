import express from 'express';
import { eventController } from './controllers/event-controller';
import { ticketController } from './controllers/ticket-controller';

const app = express();
app.use(express.json());

// Event routes
app.get('/events', eventController.getAllEvents);
app.get('/events/:id', eventController.getEventById);
app.post('/events', eventController.createEvent);
app.put('/events/:id', eventController.updateEvent);
app.delete('/events/:id', eventController.deleteEvent);

// Ticket routes
app.get('/tickets', ticketController.getAllTickets);
app.get('/tickets/:id', ticketController.getTicketById);
app.post('/tickets', ticketController.createTicket);
app.put('/tickets/:id', ticketController.updateTicket);
app.delete('/tickets/:id', ticketController.deleteTicket);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});