var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy   = require('passport-local').Strategy;

var configAuth = require('./auth');
var User = require('../models/user.js');

module.exports = function(passport){

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done){
        User.findUserByEmail(email, function(status){
            if(status){
                return done(null, false, { message: 'email is already taken'});
            }
            else{
                var newUser = new User.User(req.body.name, email, password);
                newUser.save();
                return done(null, newUser);
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        User.findUserByEmail(email, function(status){
            var user = status[0];
            console.log(user);
            if(!user)
                return done(null, false, {message: 'no user with this email'});
            
            if(!User.validPassword(user.passwordHash, password))
                return done(null, false, {message: 'invalid password'});
            
            return done(null, user);
        });
    }));

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findUserByEmail(profile.emails[0].value, function(status){
            if (status) {
                console.log(status);
                return done(null, status[0]);
            }
            else {
                var newUser = new User.User(profile.name.familyName + ' ' + profile.name.givenName, profile.emails[0].value);
                newUser.save();
                return done(null, newUser);
            }
        });
    }
    ));

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, done) {
        User.findUserByEmail(profile.emails[0].value, function(status){
            if (status) {
                console.log(status);
                return done(null, status[0]);
            }
            else {
                var newUser = new User.User(profile.name.familyName + ' ' + profile.name.givenName, profile.emails[0].value);
                newUser.save();
                return done(null, newUser);
            }
        });
    }
    ));

    passport.serializeUser(function(user, done) {
        console.log('Serialize user called.');
        return done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        console.log('Deserialize user called.');
        User.findUserByEmail(user.email, function(status){
            if (status) {
                return done(null, status[0]);
            }
            else
                return done(null, null);
        });
    });
}