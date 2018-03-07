// dependencies
const path = require('path');
const fs = require('fs');
const { execSync, exec } = require('child_process');
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

// API
app.use('/api', api());

// webhooks
app.use('/webhooks', webhooks(config.ghsecret));

// webpack
if (!config.production) {
    const webpackCompiler = webpack(webpackconfig);
    const wpmw = webpackMiddleware(webpackCompiler, {});
    const wphmw = webpackHotMiddleware(webpackCompiler);
    app.use(wpmw);
    app.use(wphmw);

    // static files
    app.use(express.static('public'));

    // SPA
    app.use((req, res, next) => {
        if (req.method == 'GET') {
            const indexFile = `${webpackconfig.output.path}/index.html`;
            const index = webpackCompiler.outputFileSystem.readFileSync(indexFile);
            res.contentType('text/html');
            res.end(index);
        } else {
            res.status(405);
            res.statusMessage('Method not allowed');
            res.end();
        }
    });
} else {
    // kick off manual webpack compile
    winston.info('Running webpack...');
    exec(path.join(__dirname, 'node_modules/.bin/webpack'), (e, stdout, stderr) => {
        if (e) {
            winston.error('Webpack error');
            if (stdout) winston.error(stdout);
            if (stderr) winston.error(stderr);
        } else {
            winston.info('Webpack done');
            if (stdout) winston.info(stdout);
            if (stderr) winston.error(stderr);
        }
    });

    // static files
    app.use(express.static('public'));

    // SPA
    app.use((req, res) => {
        const indexFile = path.resolve(__dirname, 'public/index.html');

        fs.readFile(indexFile, (e, data) => {
            if (e) {
                winston.error('error reading %s: %s', indexFile, e);
                res.status(500).end();
            } else {
                res.contentType('text/html');
                res.end(data);
            }
        });
    });
}





// Listen
app.listen(config.port, () => winston.info(`Listening on port ${config.port}!`));
