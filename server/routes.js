var path = require('path');
var Event = require('./models/event.js');

module.exports = function(app, passport){
    // =====================================
	// HOME PAGE (with login links) ========
	// =====================================

	app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../client', 'index.html'));
	});

    app.post('/newEvent', function(req, res){
        var newEvent = new Event.Event(req.body.name, req.body.description, req.user.id);
        newEvent.save();
        res.end(JSON.stringify(newEvent));
    });

    app.get('/getEventsByOwner', function(req, res){
        Event.findEventsByOwner(req.user.id, function(status){
            if (status) {
                console.log(status);
                return done(null, status);
            }
            else
                return done(null, null);
        });
    });

    app.get('/currentUser', function(req, res){
        console.log(req.user);
        if(req.user)
            res.end(JSON.stringify(req.user));
        else
            res.end(JSON.stringify(undefined));
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/#!securedPage',
                                        failureRedirect: '/' }));

    app.get('/auth/google',
        passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));

    app.get('/auth/google/callback', 
        passport.authenticate('google', { successRedirect: '/#!securedPage', 
                                    failureRedirect: '/' }));
    
    app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/#!securedPage', // redirect to the secure profile section
		failureRedirect : '/'
	}));

    app.post('/newInvite', function(req, res){
        console.log('new Invite:');
        Event.createInvite(req.body.eventId, req.body.email);
        res.end();
    });

    app.get('/myEvents', function(req, res){
        console.log("my events");
        console.log(req.user.id);
        Event.findEventsByUser(req.user.id, function(err, rows){
            if(err)
                console.log(err);
            res.end(JSON.stringify(rows));
        });
    });

    app.get('/invite?', function(req, res){
        console.log(req.query);
        res.redirect('/?invite='+ req.query.code);
    });

    app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/#!register'
	}));
    
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

}