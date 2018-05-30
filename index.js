// dependencies
const path = require('path');
const fs = require('fs');
const { execSync, exec } = require('child_process');

// module requires
const express = require('express');
const winston = require('winston');

// local requires
const api = require('./api');
const config = require('./config');

// set up logging
winston.configure({
    transports: [new (winston.transports.Console)({ level: config.loglevel, colorize: true })]
});
winston.info('starting in %s environment...', config.environment);
winston.info(`loglevel: ${config.loglevel}`);
Object.keys(winston.levels).forEach(x=>winston[x](`👍`));
winston.info('listen port: %s', config.port);

// express app
const app = express();

// API
app.use('/api', api());

// webpack
if (!config.production) {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackconfig = require('./webpack.config');

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

    // static files
    app.use(express.static('public'));

    //cache index file
    const indexFile = path.resolve(__dirname, 'public/index.html');
    const indexData = fs.readFileSync(indexFile);

    // SPA
    app.use((req, res) => {
        const indexFile = path.resolve(__dirname, 'public/index.html');

        res.contentType('text/html');
        res.end(indexData);
    });
}


// Listen
app.listen(config.port, () => winston.info(`Listening on port ${config.port}!`));
