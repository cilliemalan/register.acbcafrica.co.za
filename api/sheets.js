const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const chmod = util.promisify(fs.chmod);

const moment = require('moment');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { GoogleAuth, OAuth2Client } = require('google-auth-library');

const { googleSheet: spreadsheetId } = require('../config');

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

const _A = "A".charCodeAt(0);
const columnNumberToLetter = (columnNumber) => {
    const big = parseInt(columnNumber / 26);
    const sml = columnNumber % 26;

    if (big == 0) {
        return String.fromCharCode(_A + sml);
    } else {
        return `${columnNumberToLetter(big - 1)}${columnNumberToLetter(sml)}`
    }
}

const get = (auth, request) => {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            auth, spreadsheetId,
            ...request
        }, (err, response) => {
            if (err || !response || !response.data) {
                reject(err || 'could not retrieve data');
            } else {
                resolve(response.data);
            }
        });
    });
}

const update = (auth, request) => {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.update({
            auth, spreadsheetId,
            valueInputOption: 'USER_ENTERED',
            ...request
        }, (err, response) => {
            if (err || !response || !response.data) {
                reject(err || 'could not update data');
            } else {
                resolve(response.data);
            }
        });
    });
}

const mapValues = (arr) => arr.map(v => {
    if (typeof v == "number") {
        return v;
    } else if (typeof v == "string") {
        return `'${v}`;
    } else if (typeof v == "boolean") {
        return v;
    } else if (util.isDate(v)) {
        return moment(v).format('YYYY-MM-DD hh:mm:ss');
    } else if (!v) {
        return "";
    } else {
        return "invalid";
    }
});

const addEntryToSheet = async (sheet, entry) => {
    const auth = await authorize();

    const header = Object.keys(entry);
    const values = mapValues(Object.values(entry));

    // check if there is a header
    const lastColumn = columnNumberToLetter(header.length - 1);
    const headerRange = `'${sheet}'!A1:${lastColumn}1`;
    const { values: currentHeaderValues } = await get(auth, { range: headerRange });
    if (!currentHeaderValues ||
        !currentHeaderValues.length ||
        currentHeaderValues[0].length < header.length) {
        //something is missing from the header
        await update(auth, { range: headerRange, resource: { values: [header] } });
    }

    // find first empty row. assumes the first column is always populated
    const { values: entryValues } = await get(auth, { range: `'${sheet}'!A2:A`, majorDimension: "COLUMNS" });
    const firstEmptyRow = entryValues ? entryValues[0].length + 2 : 2;

    // set the data
    const updateRange = `'${sheet}'!A${firstEmptyRow}:${lastColumn}${firstEmptyRow}`;
    await update(auth, { range: updateRange, resource: { values: [values] } });
}

module.exports = { addEntryToSheet };