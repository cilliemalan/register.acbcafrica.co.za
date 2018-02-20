const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const winston = require('winston');
const { exec } = require('child_process');

function processEvent(event, payload) {
    switch (event) {
        case 'ping':
            winston.info('received ping from hook ID %s', payload.hook_id);
            break;
        case 'push':
            winston.info('received push event, running git pull.');
            exec('git pull', (error, stdout, stderr) => {
                console.log(stdout);
                console.error(stderr);
                if (error) {
                    winston.error('failed to pull: %s', error);
                } else {
                    winston.info('pull succeeded');
                }
                winston.info('restarting in 15 seconds...');
                setTimeout(() => {
                    winston.info('restarting now.');
                    process.exit(0);
                }, 15000);
            });
        default:
            winston.info('not processing unsupported event: %s', event);
    }
}

const webhooks = (secret) => {
    const router = express.Router();

    router.use(bodyParser.raw({ type: 'application/json' }));

    router.post('/github', (req, res) => {
        winston.verbose('github hook request received: %s', req.url);

        const signatureHeader = req.get("X-Hub-Signature");
        const signatureMatch = signatureHeader && signatureHeader.match(/([a-zA-Z0-9-])=([a-zA-Z0-9]+)/);
        const signatureAlgorithm = signatureMatch && signatureMatch[1];
        const signature = signatureMatch && signatureMatch[2];
        const event = req.get("X-GitHub-Event");
        const body = req.body;

        const badRequest = (reason) => {
            winston.warn('sending back 400 bad request: %s', reason);
            res.status(400); res.end();
        }

        if (!event) {
            badRequest('X-GitHub-Event header was not present');
        } else if (!body) {
            badRequest('No request body');
            return;
        } else {
            winston.info('got github webhook %s event', event);
            if (secret) {
                if (!signature) {
                    badRequest('no signature');
                    return;
                } else {
                    winston.verbose('checking signature signed with HMAC %s', signatureAlgorithm);
                    const digest = crypto.createHmac(signatureAlgorithm, secret).update(body).digest('hex');
                    if (digest != signature) {
                        badRequest('signature mismatch');
                        return;
                    }
                }
            }

            const requestString = body.toString("utf-8");
            let parsed;
            try {
                parsed = JSON.parse(requestString);
            } catch (error) {
                winston.warn('error parsing JSON: %s', error);
                badRequest('invalid JSON');
                return;
            }

            processEvent(event, parsed);

            res.status(200);
            res.end();
        }
    })

    return router;
}

module.exports = webhooks;