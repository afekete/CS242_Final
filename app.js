var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); //HTTP request logger middleware for node.js
var cookieParser = require('cookie-parser'); //Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
var bodyParser = require('body-parser'); //Node.js body parsing middleware.

// Store the routes in vars to be used by express
var index = require('./routes/index');
var db = require('./routes/database');
var main = require('./routes/main');
var mosaic = require('./routes/mosaic');
var user = require('./routes/user');
var signin = require('./routes/signin');
var register = require('./routes/register')
var location = require('./routes/location')
var profile = require('./routes/profile')

// Create the express web app
var app = express();

// Set the relative path of the views and set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set up all the middleware. Each server request will go through all the middleware
// and run any that matches the request path
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', [index, main, mosaic, user ,signin, register, location, profile, db]);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('error')
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('error');
});


module.exports = app;
