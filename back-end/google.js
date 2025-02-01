const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const axios = require('axios');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const strapiApi = axios.create({
  baseURL: "http://localhost:1337",
  headers: {
    Authorization: `Bearer 98d11447c62f35e0fbe019cdcf33187fc911f642b01d50080e6376d89d328b64cd942cd54fa29a93b26e4d189c9f770d0551226584abf42ef0b85fa35e2b1409e26aee8a2d337a0fb72d72b934f437db4e533b333d67d676e96a8c32c1225a9358366c2bcaad9da9920a54aa85591f3e32ac35f99779149abf2080209231393c`,
    'Content-Type': 'application/json',
  },
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function fetchSheetData(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: '1BCdMB40d9N905pRsy_NTGCGBWEPBwoXbf3YFlxY_Icc',
      range: 'events!A2:G', // Assuming the data starts from A2
    });
    return res.data.values;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

async function fetchCMSEvents() {
  try {
    const response = await strapiApi.get('/api/events');
    return response.data.data; // Strapi v4 wraps the data in a 'data' property
  } catch (error) {
    console.error('Error fetching CMS events:', error.message);
    return null;
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

async function updateEvent(id, event) {
  try {
    await strapiApi.put(`/api/events/${id}`, { data: event });
    console.log(`Updated event: ${event.name}`);
  } catch (error) {
    console.error(`Error updating event ${event.name}:`, error.message);
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

async function syncEvents(sheetEvents, cmsEvents) {
  const sheetEventsMap = new Map(sheetEvents.map((event) => [event[0], event]))
  const cmsEventsMap = new Map(cmsEvents.map((event) => [event.name, event]))

  // Create or update events
  for (const [name, sheetEvent] of sheetEventsMap) {
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

let isSyncInProgress = false;

async function startSync() {
  try {
    const auth = await authorize();
    console.log('Authorization successful. Starting sync...');
    
    async function performSync() {
      if (isSyncInProgress) {
        console.log('A sync is already in progress. Skipping this cycle.');
        return;
      }

      isSyncInProgress = true;
      try {
        const sheetEvents = await fetchSheetData(auth);
        const cmsEvents = await fetchCMSEvents();
        
        if (sheetEvents && cmsEvents) {
          await syncEvents(sheetEvents, cmsEvents);
          console.log(`Sync completed at ${new Date().toLocaleString()}`);
        } else {
          console.log('Sync failed due to data fetching errors');
        }
      } catch (error) {
        console.error('Error during sync:', error.message);
      } finally {
        isSyncInProgress = false;
      }
    }

    // Perform initial sync
    await performSync();
    
    // Set up interval to sync every 10 seconds (as per your original code)
    setInterval(performSync, 10000);
  } catch (error) {
    console.error('Error in sync process:', error.message);
  }
}

// Start the sync process
startSync();

// Keep the script running
process.stdin.resume();

console.log('Sync script started. Press Ctrl+C to exit.');