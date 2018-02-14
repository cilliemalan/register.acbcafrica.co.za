const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const webhooks = (secret) => {
    const router = express.Router();

    router.use(bodyParser.raw());

    router.get('/github', (req, res) => {
        const signature = req.get("X-Hub-Signature").match(/([a-zA-Z0-9-])=([a-zA-Z0-9]+)/);
        const body = req.body;

        const badRequest = () => { res.status(400); res.end(); }

        if(!body) {
            badRequest();
        } else {
            if (secret) {
                if (!signature) {
                    badRequest();
                } else {
                    const digest = crypto.createHmac(signature, secret).update(body).digest('hex');
                    if(digest != signature[1]) {
                        badRequest();
                    }
                }
            }

            const parsed = JSON.parse(req.toString("utf-8"));
        }
    })

    return router;
}

module.exports = () => (req, res, next) => {

}