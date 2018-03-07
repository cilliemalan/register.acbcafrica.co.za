const winston = require('winston');
const express = require('express');
const reCAPTCHA = require('recaptcha2');
const forms = require('../public/data/forms.json');
const { addEntryToSheet } = require('./sheets');

const config = require('../config');

const recaptcha = new reCAPTCHA({
    siteKey: config.recaptchaKey,
    secretKey: config.recaptchaSecret
});

module.exports = () => {

    const api = express.Router();

    api.use((req, res, next) => {
        res.on('finish', () => {
            winston.verbose('API %s request for %s by %j -> %s', req.method, req.url, (req.user && req.user.sub) || 'anonymous', res.statusCode);
        });
        next();
    });

    api.use(express.json());

    api.get('/', (req, res) => res.json({ status: 'ok' }));

    api.post('/submit', (req, res) => {
        const { body } = req;
        if (typeof body != "object") {
            res.status(400).end('An invalid request was received');
        } else {
            const { form, details, token } = body;
            const formData = forms[form];
            if (!form || !details || !token || (typeof form != "string") || (typeof details != "object")) {
                res.status(400).end('An invalid request was received');
            } else if (!formData) {
                res.status(400).end('The form is not supported');
            } else {
                const { title, firstname, lastname,
                    contactNumber, email, country,
                    church, options } = details;
                const { sheet } = formData;

                if (!title || !firstname || !lastname || !contactNumber || !email || !options) {
                    res.status(400).end('An invalid request was received');
                } else {

                    recaptcha.validate(token)
                        .catch(() => res.status(400).end('failed to validate recaptcha token'))
                        .then(async () => {
                            const formData = {
                                title, firstname, lastname, contactNumber, email, country, church,
                                ...options
                            }
                            await addEntryToSheet(sheet, { date: new Date(), ...formData });
                        })
                        .then(() => res.end())
                        .catch(e => { winston.error(e); res.status(500).end('Internal server error'); });


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