const fs = require('fs');

const port = process.env.PORT || 3000;
const root = process.env.URL || "http://localhost:3000/";
const loglevel = process.env.LOGLEVEL || 'verbose';

const issuer = process.env.JWT_ISSUER || "https://acbcafrica.eu.auth0.com/";
const audience = process.env.JWT_AUDIENCE || 'https://acbcafrica.co.za/';
const oAuthDomain = issuer.match(/^https:\/\/(.+)\//)[1];

const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;

const recaptchaKey = process.env.RECAPTCHA_KEY;
const recaptchaSecret = process.env.RECAPTCH_SECRET;

const gaTrackingId = process.env.GA_TRACKING_ID || 'UA-114404288-1';

const googleSheet = process.env.GOOGLE_SHEET;

const sendGridKey = process.env.SENDGRID_KEY;
const defaultFromEmail = process.env.DEFAULT_FROM_EMAIL || 'info@acbcafrica.co.za';

const environment = process.env.NODE_ENV || 'development';
const production = environment == 'production';

module.exports = {
    port,
    root,
    loglevel,
    issuer,
    audience,
    clientId,
    clientSecret,
    oAuthDomain,
    recaptchaKey,
    recaptchaSecret,
    gaTrackingId,
    googleSheet,
    sendGridKey,
    defaultFromEmail,
    environment,
    production
}