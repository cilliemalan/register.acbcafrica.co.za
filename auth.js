
const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const config = require('./config');

const issuer = process.env.JWT_ISSUER;

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
    {
        domain: config.oAuthDomain,
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: `${config.root}auth/callback`
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }
);


module.exports = () => {

    passport.use(strategy);

    // This can be used to keep a smaller payload
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    const router = express.Router();

    router.use(passport.initialize());
    router.use(passport.session());

    // Perform the login
    router.get('/auth/login',
        passport.authenticate('auth0', {
            clientID: config.clientId,
            domain: config.oAuthDomain,
            redirectUri: `${config.root}auth/callback`,
            audience: `${config.issuer}userinfo`,
            responseType: 'code',
            scope: 'openid profile'
        }),
        function (req, res) {
            res.redirect('/');
        }
    );

    // Perform session logout and redirect to homepage
    router.get('/auth/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // Perform the final stage of authentication and redirect to '/'
    router.get(
        '/auth/callback',
        passport.authenticate('auth0', {
            failureRedirect: '/'
        }),
        function (req, res) {
            res.redirect(req.session.returnTo || '/');
        }
    );

    return router;
}