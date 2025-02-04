const fs = require("fs").promises
const path = require("path")
const process = require("process")
const { authenticate } = require("@google-cloud/local-auth")
const { google } = require("googleapis")
const axios = require("axios")

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
const TOKEN_PATH = path.join(process.cwd(), "token.json")
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json")

const strapiApi = axios.create({
  baseURL: "http://localhost:1337",
  headers: {
    Authorization: `Bearer 98d11447c62f35e0fbe019cdcf33187fc911f642b01d50080e6376d89d328b64cd942cd54fa29a93b26e4d189c9f770d0551226584abf42ef0b85fa35e2b1409e26aee8a2d337a0fb72d72b934f437db4e533b333d67d676e96a8c32c1225a9358366c2bcaad9da9920a54aa85591f3e32ac35f99779149abf2080209231393c`,
    "Content-Type": "application/json",
  },
})

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    return client
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })
  if (client.credentials) {
    await saveCredentials(client)
  }
  return client
}

async function fetchEventSheetData(auth) {
  const sheets = google.sheets({ version: "v4", auth })
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: "1BCdMB40d9N905pRsy_NTGCGBWEPBwoXbf3YFlxY_Icc",
      range: "events!A2:G", // Assuming the data starts from A2
    })
    return res.data.values
  } catch (error) {
    console.error("Error fetching data:", error.message)
    return null
  }
}

async function fetchTicketsSheetData(auth) {
  const sheets = google.sheets({ version: "v4", auth })
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: "1BCdMB40d9N905pRsy_NTGCGBWEPBwoXbf3YFlxY_Icc",
      range: "tickets!A2:F", // Assuming the data starts from A2
    })
    return res.data.values
  } catch (error) {
    console.error("Error fetching data:", error.message)
    return null
  }
}

async function fetchCMSEvents() {
  try {
    const response = await strapiApi.get("/api/events")
    return response.data.data // Strapi v4 wraps the data in a 'data' property
  } catch (error) {
    console.error("Error fetching CMS events:", error.message)
    return null
  }
}

async function fetchCMSTickets() {
  try {
    const response = await strapiApi.get("/api/tickets")
    return response.data.data // Strapi v4 wraps the data in a 'data' property
  } catch (error) {
    console.error("Error fetching CMS events:", error.message)
    return null
  }
}

async function createEvent(event) {
  try {
    const response = await strapiApi.post("/api/events", { data: event })
    console.log(`Created event: ${event.name}`)
    return response.data
  } catch (error) {
    console.error(`Error creating event ${event.name}:`, error.response?.data || error.message)
    return null
  }
}

async function createTicket(ticket) {
  try {
    const response = await strapiApi.post("/api/tickets", { data: ticket })
    console.log(`Created ticket: ${ticket}`)
    return response.data
  } catch (error) {
    console.error(`Error creating ticket ${ticket.name}:`, error.response?.data || error.message)
    return null
  }
}

async function updateEvent(id, event) {
  try {
    await strapiApi.put(`/api/events/${id}`, { data: event })
    console.log(`Updated event: ${event.name}`)
  } catch (error) {
    console.error(`Error updating event ${event.name}:`, error.message)
  }
}

async function updateTicket(id, ticket) {
  try {
    await strapiApi.put(`/api/tickets/${id}`, { data: ticket })
    console.log(`Updated ticket: ${ticket.name}`)
  } catch (error) {
    console.error(`Error updating ticket ${ticket.name}:`, error.message)
  }
}

async function deleteEvent(id) {
  try {
    const res = await strapiApi.delete(`/api/events/${id}`)
    console.log(`Deleted event with ID: ${id}`)
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error.response?.data || error.message)
  }
}

async function deleteTicket(id) {
  try {
    const res = await strapiApi.delete(`/api/tickets/${id}`)
    console.log(`Deleted ticket with ID: ${id}`)
  } catch (error) {
    console.error(`Error deleting ticket with ID ${id}:`, error.response?.data || error.message)
  }
}

async function syncEvents(sheetEvents, cmsEvents) {
  const sheetEventsMap = new Map(sheetEvents.map((event) => [event[0], event]))
  const cmsEventsMap = new Map(cmsEvents.map((event) => [event.name, event]))

  if (sheetEventsMap.size === 0) {
    for (const [cmsEvent] of cmsEventsMap) {
      await deleteEvent(cmsEvent.documentId)
      await delay(1000)
    }
    return
  }

  // Create or update events
  for (const [name, sheetEvent] of sheetEventsMap) {
    if (!sheetEvent[0] && !sheetEvent[1] && !sheetEvent[2] && !sheetEvent[3] && !sheetEvent[4] && !sheetEvent[5] && !sheetEvent[6]) {
      console.log('No new events detected. Skipping event sync.');
      continue;
    }

    const eventData = {
      name: sheetEvent[0],
      date: sheetEvent[1],
      venue: sheetEvent[2],
      description: sheetEvent[3],
      max_capacity: Number.parseInt(sheetEvent[4]),
      start_time: sheetEvent[5],
      end_time: sheetEvent[6],
    }

    console.log("Processing event:", eventData.name)

    if (cmsEventsMap.has(eventData.name)) {
      const cmsEvent = cmsEventsMap.get(eventData.name)
      console.log("Existing CMS event:", cmsEvent)
      for (const key in eventData) {
        if (eventData[key] !== cmsEvent[key]) {
          console.log(`Updating ${key}: ${cmsEvent[key]} -> ${eventData[key]}`)
          cmsEvent[key] = eventData[key]
        }
      }
      await updateEvent(cmsEvent.documentId, eventData)
    } else {
      console.log("Creating new event:", eventData)
      const createdEvent = await createEvent(eventData)
      if (createdEvent) {
        console.log("Event created successfully:", createdEvent)
      }
    }

    // Add a delay of 1 second between each event creation
    await delay(1000)
  }

  // Delete events that are in CMS but not in the sheet
  for (const [name, cmsEvent] of cmsEventsMap) {
    if (!sheetEventsMap.has(name)) {
      await deleteEvent(cmsEvent.documentId)
      await delay(1000)
    }
  }
}

async function syncTickets(sheetTickets, cmsTickets, cmsEvents) {
  const sheetTicketsMap = new Map(sheetTickets.map((ticket) => [ticket[5], ticket]))
  const cmsTicketsMap = new Map(cmsTickets.map((ticket) => [ticket.seat, ticket]))
  
  // Create or update tickets
  for (const [name, sheetTicket] of sheetTicketsMap) {
    // Find the corresponding event and get its ID
    if(!sheetTicket[0] && !sheetTicket[1] && !sheetTicket[2] && !sheetTicket[3] && !sheetTicket[4] && !sheetTicket[5]) {
      console.log('No new tickets detected. Skipping ticket sync.');
      continue;
    }

    const eventId = cmsEvents.find((event) => event.name === sheetTicket[0])?.documentId

    const ticketData = {
      event: eventId, // This links to the event's ID in Strapi
      type: sheetTicket[1],
      price: Number.parseFloat(sheetTicket[2]),
      statusTicket: sheetTicket[3],
      name: sheetTicket[4],
      seat: sheetTicket[5],
    }

    console.log("Processing ticket for event:", ticketData)

    if (cmsTicketsMap.has(ticketData.seat)) {
      const cmsTicket = cmsTicketsMap.get(ticketData.seat)
      console.log("Existing CMS ticket:", cmsTicket)

      // Only update fields that have actually changed
      const updates = {}
      if (ticketData.type !== cmsTicket.type) {
        updates.type = ticketData.type
        console.log(`Updating type: ${cmsTicket.type} -> ${ticketData.type}`)
      }
      if (ticketData.price !== cmsTicket.price) {
        updates.price = ticketData.price
        console.log(`Updating price: ${cmsTicket.price} -> ${ticketData.price}`)
      }
      if (ticketData.statusTicket !== cmsTicket.statusTicket) {
        updates.statusTicket = ticketData.statusTicket
        console.log(`Updating statusTicket: ${cmsTicket.statusTicket} -> ${ticketData.statusTicket}`)
      }
      if (ticketData.name !== cmsTicket.name) {
        updates.name = ticketData.name
        console.log(`Updating name: ${cmsTicket.name} -> ${ticketData.name}`)
      }
      if (ticketData.seat !== cmsTicket.seat) {
        updates.seat = ticketData.seat
        console.log(`Updating seat: ${cmsTicket.seat} -> ${ticketData.seat}`)
      }

      // Only update if there are actual changes
      if (Object.keys(updates).length > 0) {
        await updateTicket(cmsTicket.documentId, updates)
      } else {
        console.log("No changes needed for this ticket")
      }
    } else {
      console.log("Creating new ticket:", ticketData)
      const createdTicket = await createTicket(ticketData)
      if (createdTicket) {
        console.log("Ticket created successfully:", createdTicket)
      }
    }

    await delay(1000)
  }

  // Delete tickets that are in CMS but not in the sheet
  for (const [seat, cmsTicket] of cmsTicketsMap) {
    if (!sheetTicketsMap.has(seat)) {
      await deleteTicket(cmsTicket.documentId)
      await delay(1000)
    }
  }
}

let isSyncInProgress = false 

async function startSync() {
  try {
    const auth = await authorize()
    console.log("Authorization successful. Starting sync...")

    async function performSync() {
      if (isSyncInProgress) {
        console.log("A sync is already in progress. Skipping this cycle.")
        return
      }

      isSyncInProgress = true
      try {
        const [sheetEvents, cmsEvents, sheetTickets, cmsTickets] = await Promise.all([
          fetchEventSheetData(auth),
          fetchCMSEvents(),
          fetchTicketsSheetData(auth),
          fetchCMSTickets(),
        ])

        if (sheetEvents && cmsEvents) {
          await syncEvents(sheetEvents, cmsEvents)
        } else if (!sheetEvents && cmsEvents) {
          await Promise.all(
            cmsEvents.map(async (cmsEvent) => {
              await deleteEvent(cmsEvent.documentId)
              await delay(1000)
            }),
          )
        } else if (!sheetEvents || !cmsEvents) {
          console.log("Sync failed due to data fetching errors for events")
        }

        if (sheetTickets && cmsTickets) {
          await syncTickets(sheetTickets, cmsTickets, cmsEvents)
        } else if (!sheetTickets && cmsTickets) {
          await Promise.all(
            cmsTickets.map(async (cmsTicket) => {
              await deleteTicket(cmsTicket.documentId)
              await delay(1000)
            }),
          )
        } else if (!sheetTickets || !cmsTickets) {
          console.log("Sync failed due to data fetching errors for tickets")
        }

        console.log(`Sync completed at ${new Date().toLocaleString()}`)
      } catch (error) {
        console.error("Error during sync:", error.message)
      } finally {
        isSyncInProgress = false
      }
    }

    // Perform initial sync
    await performSync()

    // Set up interval to sync every 10 seconds
    setInterval(performSync, 15000)
  } catch (error) {
    console.error("Error in sync process:", error.message)
  }
}

// Start the sync process
startSync()

// Keep the script running
process.stdin.resume()

console.log("Sync script started. Press Ctrl+C to exit.")

