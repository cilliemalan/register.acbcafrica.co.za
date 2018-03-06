const fs = require('fs');
const util = require('util');
const readline = require('readline');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { GoogleAuth, OAuth2Client } = require('google-auth-library');
const opn = require('opn');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';




async function main() {

    // Load client secrets from a local file.
    const content = await readFile('client_secret.json');

    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    const thing = await authorize(JSON.parse(content));

    await listMajors(thing);
}

main().catch(console.error);



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
async function authorize(credentials) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new GoogleAuth();
    var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    let token;
    try {
        token = JSON.parse(await readFile(TOKEN_PATH));
    } catch (e) { }

    if (token) {
        const { expiry_date } = token;
        const expires = new Date(expiry_date);
        const now = new Date();
        if (true || expires <= now) {
            token = await refreshToken(oauth2Client, token);
        }
    } else {
        token = await getNewToken(oauth2Client);
    }

    oauth2Client.credentials = token;
    return oauth2Client;
}

async function refreshToken(oauth2Client, token) {
    oauth2Client.credentials = token;
    const { credentials } = await oauth2Client.refreshAccessToken();
    if (!credentials) throw "Coundlt get new credentials";
    storeToken(credentials);
    return credentials;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *     client.
 */
function getNewToken(oauth2Client) {

    return new Promise((resolve, reject) => {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('Authorizing...');
        opn(authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from the page here: ', function (code) {
            rl.close();
            oauth2Client.getToken(code).then(({ tokens }) => {
                storeToken(tokens);
                resolve(tokens);
            });
        });
    });

}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors(auth) {
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Class Data!A2:E',
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        const rows = response && response.data && response.data.values;

        if (!rows || rows == 0) {
            console.log('No data found.');
        } else {
            console.log('Name, Major:');
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                // Print columns A and E, which correspond to indices 0 and 4.
                console.log('%s, %s', row[0], row[4]);
            }
        }
    });
}
