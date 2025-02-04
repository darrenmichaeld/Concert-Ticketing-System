
// npx ts-node src/index.ts  

import express from "express"
import { eventController } from './controllers/event-controller';
import { ticketController } from './controllers/ticket-controller';
import cors from "cors"

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(cors());

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

// New route for real-time updates from Google Sheets
// app.post('/api/sheets-webhook', (req, res) => {
//   const { action, data, sheetName, timestamp } = req.body;

//   console.log(`Received ${action} action from sheet: ${sheetName}`);
//   console.log('Data:', data);
//   console.log('Timestamp:', timestamp);

//   // Process the data based on the action
//   try {
//     switch(action) {
//       case 'create':
//         // Assuming data contains the necessary information for creating an event or ticket
//         if (sheetName === 'events') {
//           eventController.createEventFromSheet(data);
//           console.log('Created new event:', data);
//         } else if (sheetName === 'tickets') {
//           ticketController.createTicketFromSheet(data);
//           console.log('Created new ticket:', data);
//         }
//         break;
//       case 'update':
//         // Assuming data contains id and the updated information
//         const { id } = data; // Extract id from data
//         if (sheetName === 'events') {
//           eventController.updateEvent(id, data);
//           console.log('Updated event:', data);
//         } else if (sheetName === 'tickets') {
//           ticketController.updateTicket(id, data);
//           console.log('Updated ticket:', data);
//         }
//         break;
//       case 'delete':
//         // Assuming data contains the id of the item to delete
//         const { deleteId } = data; // Extract id from data
//         if (sheetName === 'events') {
//           eventController.deleteEventFromSheet(deleteId);
//           console.log('Deleted event with id:', deleteId);
//         } else if (sheetName === 'tickets') {
//           ticketController.deleteTicketFromSheet(deleteId);
//           console.log('Deleted ticket with id:', deleteId);
//         }
//         break;
//       default:
//         console.log('Unknown action:', action);
//     }
//   } catch (error) {
//     console.error('Error processing webhook:', error);
//     return res.status(500).json({ success: false, message: 'Error processing webhook' });
//   }

//   // Send a response back to the Google Apps Script
//   res.json({ success: true, message: `Action: ${action}, Webhook received and processed` });
// });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

