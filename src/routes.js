var router = require('express').Router();
const passportConfig = require('./lib/passport');

var qs = require('qs');

// init route
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/profile');
    }

    return res.redirect('/login');
});

// oauth login
router.get('/login', passportConfig.passport.authenticate('auth0', {
    scope: 'openid email profile'
}), (req, res) => {
    res.redirect('/profile');
});

// oauth callback
router.get('/callback', passportConfig.passport.authenticate('auth0', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/');
});

// oauth profile info
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.send(req.user);
});

// implement logout 
router.get('/logout', (req, res) => {
    req.logout(function () {

        // This will log the user out of your application, but not Auth0, so they could still be logged in elsewhere
        // To also log out of Auth0, redirect the user to the Auth0 logout endpoint
        const returnTo = 'http://localhost:3000';
        const clientID = encodeURIComponent(process.env.AUTH0_CLIENT_ID);
        const logoutURL = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${clientID}&returnTo=${returnTo}`;

        return res.redirect(logoutURL);
    });
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}


module.exports = router;