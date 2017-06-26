var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');
var User = require('../models/user.js');

module.exports = function(passport){
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