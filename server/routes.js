var path = require('path');

module.exports = function(app, passport){
    // =====================================
	// HOME PAGE (with login links) ========
	// =====================================

	app.get('/', function(req, res) {
        console.log(path.join(__dirname, '../client', 'index.html'));
        res.sendFile(path.join(__dirname, '../client', 'index.html'));
	});

    app.get('/securedPage', function(req, res){
        console.log(req.user);
        if(req.isAuthenticated())
            res.sendFile(path.join(__dirname, '../client', 'securedPage.html'));
        else
            res.redirect('/');
    });

    app.get('/currentUser', function(req, res){
        console.log(req.user);
        if(req.user)
            res.end(JSON.stringify(req.user));
        else
            res.end('sdfdsf');
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
    
    app.get('/logout', function(req, res){
            req.logout();
            res.redirect('/');
    });
}