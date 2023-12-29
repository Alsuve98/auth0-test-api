const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const passportConfig = require('./lib/passport');
const router = require('./routes');

dotenv.config();

const app = express();
app.use(express.json());

// Configure Express to use Passport and Sessions
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passportConfig.passport.initialize());
app.use(passportConfig.passport.session());


app.use('/', router);


// 404 handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: process.env.NODE_ENV !== 'production' ? err : {}
    });
});

// Init server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
