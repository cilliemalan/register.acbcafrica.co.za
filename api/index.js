const winston = require('winston');
const express = require('express');
const reCAPTCHA = require('recaptcha2');
const forms = require('../public/data/forms.json');
const { addEntryToSheet } = require('./sheets');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const _ = require('lodash');
const moment = require('moment');

const config = require('../config');
const { sendTransactionalMail } = require('./sendgrid');

const recaptcha = config.recaptchaKey ? new reCAPTCHA({
    siteKey: config.recaptchaKey,
    secretKey: config.recaptchaSecret
}) : undefined;

const encryptionKey = config.recaptchaSecret || 'n/a';


// prepare childcare data for forms
const formsChildcare = _(forms).toPairs()
    .filter(([_, { childcare }]) => childcare)
    .map(([id, { childcare }]) => {
        const days = childcare && childcare.days || [];
        const slots = _(days)
            .flatMap(day => day.slots)
            .uniq()
            .orderBy(x => x)
            .value();
        const dates = days.map(({ date }) => date);
        const dateDays = days.map(({ date }) => moment(date).format('ddd'));
        const daysByDate = {};
        days.forEach(day => daysByDate[day.date] = day.slots);

        return [id, { slots, dates, dateDays, daysByDate, ...childcare }];
    }).fromPairs()
    .value();

const formatCost = (a) =>
    a == 0 ? '(nothing)'
        : a.toLocaleString('en-ZA', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

if (recaptcha) winston.info('recaptcha active');
else winston.info('recaptcha disabled due to no key');

const generateSignature = () => {
    const salt = crypto.randomBytes(32).toString('hex');
    const expires = new Date().getTime() + 86400000;
    const signature = crypto.createHmac('sha256', encryptionKey)
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
            const compsignature = crypto.createHmac('sha256', encryptionKey)
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

    api.post('/submit', async (req, res) => {

        if (!verifySignature(req.cookies._rctk)) {
            res.status(400).end('No verification cookie was present');
        } else {

            const { body } = req;
            if (typeof body != "object") {
                res.status(400).end('An invalid request was received');
            } else {
                const { form, details } = body;
                const formData = forms[form];
                const childcareData = formsChildcare[form];
                if (!form || !details || (typeof form != "string") || (typeof details != "object")) {
                    res.status(400).end('An invalid request was received');
                } else if (!formData) {
                    res.status(400).end('The form is not supported');
                } else {
                    const { title, firstname, lastname,
                        contactNumber, email, country,
                        church, options,
                        childcare, children } = details;
                    const { sheet, mailTempateId } = formData;
                    const hasChildcare = !!childcareData && childcare && !!children.length;

                    if (!title || !firstname || !lastname || !contactNumber || !email || !options) {
                        res.status(400).end('An invalid request was received');
                    } else {

                        try {

                            const formData = {
                                title, firstname, lastname,
                                contactNumber, email, country,
                                church, childcare, ...options
                            };

                            const childcareRows = (hasChildcare ? children : []).map(({ name, age, days }) => {
                                const dayColumns = _(childcareData.dateDays)
                                    .flatMap((day, d_ix) => childcareData.slots
                                        .map((slot, s_ix) => ({ day, slot, value: days[d_ix][s_ix] })))
                                    .map(({ day, slot, value }) => [`${day} ${slot}`, value])
                                    .fromPairs()
                                    .value();

                                return ({
                                    date: new Date(),
                                    name, age,
                                    parent: `${firstname} ${lastname}`,
                                    ...dayColumns
                                });
                            });

                            await fsp.appendFile(path.resolve(__dirname, '..', 'submissions_backup.json'), `${JSON.stringify(formData)}\n`);

                            for (let i = 0; i < childcareRows.length; i++) {
                                const childcareRow = childcareRows[i];
                                await fsp.appendFile(path.resolve(__dirname, '..', 'submissions_backup_childcare.json'), `${JSON.stringify(childcareRow)}\n`);
                                await addEntryToSheet(`${sheet} - Childcare`, childcareRow);
                            }
                            await addEntryToSheet(sheet, { date: new Date(), ...formData });

                            if (mailTempateId) {
                                try {
                                    const substitutions = {
                                        title, firstname, lastname,
                                        conference: forms[form].title,
                                        total: formatCost(formData.total),
                                        reference: `${form}-${lastname} ${firstname}`,
                                        childcare
                                    };

                                    await sendTransactionalMail(
                                        email,
                                        mailTempateId,
                                        undefined,
                                        undefined,
                                        substitutions);
                                } catch (e) {
                                    winston.error(`error sending confirmation email: ${e}`);
                                }
                            }

                            res.end();
                        } catch (e) {
                            winston.error(e);
                            res.status(500).end('Internal server error');
                        }
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