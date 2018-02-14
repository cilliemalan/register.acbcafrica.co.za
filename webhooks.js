const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const winston = require('winston');

function processEvent(event, payload) {
    switch(event) {
        case 'ping':
            winston.info('received ping from hook ID %s', payload.hook_id);
            break;
        default:
            winston.info('not processing unsupported event');
    }
}

const webhooks = (secret) => {
    const router = express.Router();

    router.use(bodyParser.raw());

    router.post('/github', (req, res) => {
        winston.verbose('github hook request received: %s', req.url);

        const signature = req.get("X-Hub-Signature").match(/([a-zA-Z0-9-])=([a-zA-Z0-9]+)/);
        const event = req.get("X-GitHub-Event");
        const body = req.body;

        const badRequest = (reason) => { 
            winston.verbose('sending back 400 bad request: %s', reason);
            res.status(400); res.end();
        }

        if(!event) {
            badRequest('X-GitHub-Event header was not present');
        } else if(!body) {
            badRequest('No request body');
            return;
        } else {
            winston.info('got github webhook %s event', event);
            if (secret) {
                if (!signature) {
                    badRequest('no signature');
                    return;
                } else {
                    const digest = crypto.createHmac(signature, secret).update(body).digest('hex');
                    if(digest != signature[1]) {
                        badRequest('signature mismatch');
                        return;
                    }
                }
            }

            const parsed = JSON.parse(req.toString("utf-8"));

            processEvent(event, parsed);

            res.status(200);
            res.end();
        }
    })

    return router;
}

module.exports = () => (req, res, next) => {

}