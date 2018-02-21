// dependencies
const path = require('path');
const { execSync } = require('child_process');
const output = execSync('yarn');
console.log(output.toString());


// module requires
const express = require('express');
const winston = require('winston');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// local requires
const webhooks = require('./webhooks');
const api = require('./api');
const webpackconfig = require('./webpack.config');
const config = require('./config');
const auth = require('./auth');

// env

// set up logging
winston.configure({
    transports: [new (winston.transports.Console)({ level: config.loglevel, colorize: true })]
});
winston.info('starting...');
winston.info(`loglevel: ${config.loglevel}`);
winston.info('port: %s', config.port);
winston.info('github hook secret: %s', !!config.ghsecret);


// express app
const app = express();


// set up pipeline

// Authentication
app.use(auth());

// API
app.use('/api', api());

// webhooks
app.use('/webhooks', webhooks(config.ghsecret));

// static files
app.use(express.static('public'));

// webpack
const webpackCompiler = webpack(webpackconfig);
const wpmw = webpackMiddleware(webpackCompiler, {});
const wphmw = webpackHotMiddleware(webpackCompiler);
app.use(wpmw);
app.use(wphmw);

// SPA
app.use((req, res) => {
    const indexFile = `${webpackconfig.output.path}/index.html`;
    const index = webpackCompiler.outputFileSystem.readFileSync(indexFile);
    res.contentType('text/html');
    res.end(index);
});




// Listen
app.listen(config.port, () => winston.info(`Listening on port ${config.port}!`));
