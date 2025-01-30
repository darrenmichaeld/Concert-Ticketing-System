import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
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

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  const auth = new GoogleAuth({
    scopes: SCOPES,
    keyFile: CREDENTIALS_PATH,
  });
  client = await auth.getClient();
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listEvents(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1BCdMB40d9N905pRsy_NTGCGBWEPBwoXbf3YFlxY_Icc', // Replace with your spreadsheet ID
    range: 'events!A2:G', // Adjust the range for columns A to G
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }

  console.log('Name, Date, Venue, Description, Max Capacity, Start Time, End Time:');
  rows.forEach((row) => {
    // Ensure all columns exist before accessing them to avoid undefined errors
    const name = row[0] || 'N/A';
    const date = row[1] || 'N/A';
    const venue = row[2] || 'N/A';
    const description = row[3] || 'N/A';
    const maxCapacity = row[4] || 'N/A';
    const startTime = row[5] || 'N/A';
    const endTime = row[6] || 'N/A';

    console.log(`${name}, ${date}, ${venue}, ${description}, ${maxCapacity}, ${startTime}, ${endTime}`);
  });
}

authorize().then(listEvents).catch(console.error);
