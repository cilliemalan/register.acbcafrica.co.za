const fs = require('fs');
const winston = require('winston');

function readJsonOrNull(name) {
    try {
        winston.verbose('reading %s as JSON for config', name);
        const result = fs.readFileSync(name);
        return JSON.stringify(result);
    } catch (e) {
        winston.warn('failed to read %s. The error is %s', name, e);
        return null;
    }
}

const port = process.env.PORT || 3000;
const root = process.env.URL || "http://localhost:3000/";
const ghsecret = process.env.GITHUB_HOOK_SECRET;
const loglevel = process.env.LOGLEVEL || 'verbose';

const issuer = process.env.JWT_ISSUER || "https://acbcafrica.eu.auth0.com/";
const audience = process.env.JWT_AUDIENCE || 'https://acbcafrica.co.za/';
const oAuthDomain = issuer.match(/^https:\/\/(.+)\//)[1];

const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;

const recaptchaKey = process.env.RECAPTCHA_KEY;
const recaptchaSecret = process.env.RECAPTCH_SECRET;

const gaTrackingId = process.env.GA_TRACKING_ID || 'UA-114404288-1';

const googleAccessToken = readJsonOrNull(`${__dirname}/tokens.json`);

    module.exports = {
        port,
        root,
        ghsecret,
        loglevel,
        issuer,
        audience,
        clientId,
        clientSecret,
        oAuthDomain,
        recaptchaKey,
        recaptchaSecret,
        gaTrackingId,
        googleAccessToken
    }