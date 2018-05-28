const winston = require('winston');
const express = require('express');
const reCAPTCHA = require('recaptcha2');
const forms = require('../public/data/forms.json');
const { addEntryToSheet } = require('./sheets');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const config = require('../config');

const recaptcha = () => config.recaptchaKey ? new reCAPTCHA({
    siteKey: config.recaptchaKey,
    secretKey: config.recaptchaSecret
}) : undefined;

if (recaptcha) winston.info('recaptcha active');
else winston.info('recaptcha disabled due to no key');

const generateSignature = () => {
    const salt = crypto.randomBytes(32).toString('hex');
    const expires = new Date().getTime() + 86400000;
    const signature = crypto.createHmac('sha256', config.recaptchaSecret)
        .update(`${salt}.${expires}`)
        .digest('hex');
    return `${salt}.${expires}.${signature}`
};

const verifySignature = (sig) => {
    if (!sig || !/^[a-z0-9]+\.[0-9]+\.[a-z0-9]+$/.test(sig)) {
        return false;
    }
    try {
        const [salt, expires, signature] = sig.split('.');
        const iexpires = parseInt(expires);
        if (isFinite(iexpires) && iexpires > new Date().getTime()) {
            const compsignature = crypto.createHmac('sha256', config.recaptchaSecret)
                .update(`${salt}.${expires}`)
                .digest('hex');
            return compsignature == signature;
        }
    } catch (e) { }

    return false;
};


module.exports = () => {

    const api = express.Router();

    api.use((req, res, next) => {
        res.on('finish', () => {
            winston.verbose('API %s request for %s by %j -> %s', req.method, req.url, (req.user && req.user.sub) || 'anonymous', res.statusCode);
        });
        next();
    });

    api.use(cookieParser());
    api.use(express.json());

    api.get('/', (req, res) => res.json({ status: 'ok' }));

    api.post('/validate', (req, res) => {
        const { body: { token } } = req;

        if (recaptcha) {
            recaptcha.validate(token)
                .catch(e => {
                    winston.error(`Token validation error: ${e}`);
                    res.set('Content-Type', 'text/plain; charset=utf-8')
                        .status(400)
                        .end('👎');
                })
                .then(() => {
                    const signature = generateSignature();
                    res.cookie('_rctk', signature);
                    res.set('Content-Type', 'text/plain; charset=utf-8')
                        .end('👍');
                });
        } else {
            const signature = generateSignature();
            res.cookie('_rctk', signature);
            res.set('Content-Type', 'text/plain; charset=utf-8')
                .end('👐');
        }
    });

    api.post('/submit', (req, res) => {

        if (!verifySignature(req.cookies._rctk)) {
            res.status(400).end('No verification cookie was present');
        } else {

            const { body } = req;
            if (typeof body != "object") {
                res.status(400).end('An invalid request was received');
            } else {
                const { form, details } = body;
                const formData = forms[form];
                if (!form || !details || (typeof form != "string") || (typeof details != "object")) {
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

                        const formData = {
                            title, firstname, lastname,
                            contactNumber, email, country,
                            church, ...options
                        };

                        fs.appendFile(path.resolve(__dirname, '..', 'submissions_backup.json'), `${JSON.stringify(formData)}\n`);

                        addEntryToSheet(sheet, { date: new Date(), ...formData })
                            .then(() => res.end())
                            .catch(e => {
                                winston.error(e);
                                res.status(500).end('Internal server error');
                            });
                    }
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