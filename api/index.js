const winston = require('winston');
const express = require('express');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const forms = require('../public/data/forms.json');

const config = require('../config');

module.exports = () => {

    const api = express.Router();

    var jwtCheck = jwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `${config.issuer}.well-known/jwks.json`
        }),
        credentialsRequired: false,
        audience: config.audience,
        issuer: config.issuer,
        algorithms: ['RS256']
    });



    api.use((req, res, next) => {
        res.on('finish', () => {
            winston.verbose('API %s request for %s by %j -> %s', req.method, req.url, (req.user && req.user.sub) || 'anonymous', res.statusCode);
        });
        next();
    });

    api.use(jwtCheck);

    api.get('/', (req, res) => res.json({ status: 'ok' }));

    api.post('/submit', (req, res) => {
        const { body } = req;
        if (typeof body != "object") {
            res.status(400).end('An invalid request was received');
        } else {
            const { form, details } = body;
            if (!form || details || (typeof form != "string") || (typeof details != "object")) {
                res.status(400).end('An invalid request was received');
            } else if (!(form in forms)) {
                res.status(400).end('The form is not supported');
            } else {
                const { title, firstname, lastname,
                    contactNumber, email, country,
                    church, options } = details;

                if (!title || !firstname || !lastname || !contactNumber || !email || !options) {
                    res.status(400).end('An invalid request was received');
                } else {
                    console.log({ title, firstname, lastname, contactNumber, email, country, church, options });

                    res.end();
                }
            }
        }
    })

    api.use((err, req, res, next) => {
        if (err.name == "UnauthorizedError") {
            winston.verbose('received auth error %j', err);
            res.status(403).json({ error: 'authorization', message: err.message, code: err.code });
        } else {
            winston.warn('request error for %s request for %s by %j -> %j', req.method, req.url, (req.user && req.user.sub) || 'anonymous', err);
            res.status(500).json({ error: 'server', message: 'An internal server error occurred.' });
        }
    });

    return api;
};