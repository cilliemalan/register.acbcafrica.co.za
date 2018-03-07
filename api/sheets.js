const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const chmod = util.promisify(fs.chmod);

const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { GoogleAuth, OAuth2Client } = require('google-auth-library');

const { googleSheet } = require('../config');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.resolve(__dirname, '..', 'tokens.json');

async function authorize() {
    const auth = new GoogleAuth();
    const oauth2Client = new OAuth2Client();

    let token = JSON.parse(await readFile(TOKEN_PATH));
    oauth2Client.credentials = token;

    const { expiry_date } = token;
    const expires = new Date(expiry_date);
    const now = new Date();
    if (expires <= now) {
        token = await refreshToken(oauth2Client, token);
        oauth2Client.credentials = token;
    }

    return oauth2Client;
}

async function refreshToken(oauth2Client, token) {
    oauth2Client.credentials = token;
    const { credentials } = await oauth2Client.refreshAccessToken();
    if (!credentials) throw "Coundlt get new credentials";
    await storeToken(credentials);
    return credentials;
}

async function storeToken(token) {
    await writeFile(TOKEN_PATH, JSON.stringify(token));
    await chmod(TOKEN_PATH, 0o600); //rw only by owner
    console.log('Token stored to ' + path.resolve(TOKEN_PATH));
}

export const addEntryToSheet = async (entry) => {
    const auth = await authorize();
}
