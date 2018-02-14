const express = require('express');
const winston = require('winston');

const webhooks = require('./webhooks');

const app = express();

// env
const port = process.env.PORT || 3000;
const ghsecret = process.env.GITHUB_HOOK_SECRET;
const loglevel = process.env.LOGLEVEL || 'verbose';

// set up logging
winston.configure({
    transports: [new (winston.transports.Console)({ level: loglevel, colorize: true })]
});
winston.info('starting...');
winston.info(`loglevel: ${loglevel}`);
winston.info('port: %s', port);
winston.info('github hook secret: %s', !!ghsecret);



// set up pipeline
app.use(express.static('public'));
app.use('/webhooks', webhooks(ghsecret));
app.listen(port, () => winston.info(`Listening on port ${port}!`));
