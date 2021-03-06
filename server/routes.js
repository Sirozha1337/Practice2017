var path = require('path');
var Event = require('./models/event.js');
var url = require('url');

module.exports = function(app, passport){
    /* Main route */
    app.get('/', function(req, res){
        var parsedUrl = url.parse(req.url, true);
        if(parsedUrl.query.invite)
            req.session.inviteCode = parsedUrl.query.invite;
        res.sendFile(path.join(__dirname,'../client/index.html'));
    });

    /* Create new event */
    app.post('/newEvent', function(req, res){
        Event.addEvent(req.body.name, 
            req.body.description, 
            req.user.id, 
            function(result){
                res.end(JSON.stringify(result));
            }
        );
    });

    /* Get current user info */
    app.get('/currentUser', function(req, res){
        if(req.user)
            res.end(JSON.stringify(req.user));
        else
            res.end(JSON.stringify(undefined));
    });


    /* Create new invite */
    app.post('/newInvite', function(req, res){
        Event.createInvite(req.body.eventId, req.body.email);
        res.end();
    });

    /* Get events this user invited to */
    app.get('/myEvents', function(req, res){
        Event.findEventsByUser(req.user.id, function(events){
            res.end(JSON.stringify(events));
        });
    });

    /* Get list of users invited to this event */
    app.get('/usersInEvent', function(req, res){
        Event.findUsersByEvent(req.query.eventId, function(users){
            res.end(JSON.stringify(users));
        });
    });

    /* Passport js facebook auth */
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/#!securedPage',
                                        failureRedirect: '/' }));

    /* Passport js google auth */
    app.get('/auth/google',
        passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));

    app.get('/auth/google/callback', 
        passport.authenticate('google', { successRedirect: '/#!securedPage', 
                                    failureRedirect: '/' }));
    /* Passport js local login strategy */
    app.post('/login', function(req, res, next){
        passport.authenticate('local-login', {
            successRedirect : '/#!securedPage', // redirect to the secure profile section
            failureRedirect : '/'
	    }, function(err, user, info){
            /* If user exists */
            if(user){
                /* Login user */
                req.logIn(user, function(err){
                    if(err){
                        return next(err);
                    }
                    /* Signal about wrong password */
                    if(user == false){
                        res.status(401).json(info.message);  
                    } else {
                        res.json(user.id);
                    }
                });
            }
            /* Signal about wrong email */
            else{
                res.status(401).json(info.message);  
            }
        })(req, res, next);
    });

    /* Passport js local register strategy */
    app.post('/signup', function(req, res, next){
        passport.authenticate('local-signup', 
        function(err, user, info){
            /* If user exists */
            if(user){
                res.json(user.id);
            }
            /* Signal about wrong email */
            else{
                res.status(401).json(info.message);  
            }
        })(req, res, next);
    });

    /* Passportjs logout current user */
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

}