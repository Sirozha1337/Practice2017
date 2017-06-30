var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy   = require('passport-local').Strategy;

var configAuth = require('./auth');
var User = require('../models/user.js');
var Event = require('../models/event.js');
var url = require('url');


module.exports = function(passport){
    /* Local registration strategy */
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
                User.addUser(req.body.name, email, password, function(user){
                    Event.addUserToEvent(user.id, req.session.inviteCode);
                    return done(null, user);
                });
            }
        });
    }));

    /* Local login strategy */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        User.findUserByEmail(email, function(status){
            var user = status[0];
            if(!user)
                return done(null, false, {message: 'no user with this email'});
            
            if(!User.validPassword(user.passwordHash, password))
                return done(null, false, {message: 'invalid password'});
            
            if(req.session.inviteCode)
                Event.addUserToEvent(user.id, req.session.inviteCode);
            
            return done(null, user);
        });
    }));

    /* Google sign-in strategy */
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback : true
    },
    function(req, accessToken, refreshToken, profile, done) {
        User.findUserByEmail(profile.emails[0].value, function(status){
            if (status) {
                if(req.session.inviteCode)
                    Event.addUserToEvent(status[0].id, req.session.inviteCode);
                return done(null, status[0]);
            }
            else {
                User.addUser(profile.name.familyName + ' ' + profile.name.givenName, 
                    profile.emails[0].value, 
                    null, 
                    function(user){
                        Event.addUserToEvent(user.id, req.session.inviteCode);
                        return done(null, user);
                    }
                );
            };
        });
    }));

    /* Facebook sign-in strategy */
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'emails', 'name'],
        passReqToCallback : true
    },
    function(req, accessToken, refreshToken, profile, done) {
        User.findUserByEmail(profile.emails[0].value, function(status){
            if (status) {
                if(req.session.inviteCode)
                    Event.addUserToEvent(status[0].id, req.session.inviteCode);
                return done(null, status[0]);
            }
            else {
                User.addUser(profile.name.familyName + ' ' + profile.name.givenName, 
                    profile.emails[0].value, 
                    null, 
                    function(user){
                        Event.addUserToEvent(user.id, req.session.inviteCode);
                        return done(null, user);
                    });
            };
        });
    }));

    passport.serializeUser(function(user, done) {
        return done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        User.findUserByEmail(user.email, function(status){
            if (status) {
                return done(null, status[0]);
            }
            else
                return done(null, null);
        });
    });
}