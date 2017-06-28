var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var passport = require('passport');

var passportConfig = require('./server/config/passport');
passportConfig(passport);

app.use(express.static(__dirname + '/client/'));

// Cookie and request body parsers
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 

// Use sessions 
app.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true
  }
)); 

// Use passport js
app.use(passport.initialize()); 
app.use(passport.session());

// Set up routes
var routes = require('./server/routes.js');
routes(app, passport);

// Start up the server
console.log('App listens on port 3000');
app.listen(3000);
