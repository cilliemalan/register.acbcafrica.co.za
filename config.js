const port = process.env.PORT || 3000;
const root = process.env.URL || "http://localhost:3000/";
const ghsecret = process.env.GITHUB_HOOK_SECRET;
const loglevel = process.env.LOGLEVEL || 'verbose';

const issuer = process.env.JWT_ISSUER || "https://acbcafrica.eu.auth0.com/";
const audience = process.env.JWT_AUDIENCE || 'https://acbcafrica.co.za/';
const oAuthDomain = issuer.match(/^https:\/\/(.+)\//)[1];

const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;


module.exports = {
    port,
    root,
    ghsecret,
    loglevel,
    issuer,
    audience,
    clientId,
    clientSecret,
    oAuthDomain
}