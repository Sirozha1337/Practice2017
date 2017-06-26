// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '120396248563743', // your App ID
		'clientSecret' 	: '4d8b26c929ddbaa41eed8413344900e9', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

/*	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},*/

	'googleAuth' : {
        'clientID': '1018548991256-ms5rl6vtkhiere25kgfpflo2jp1b7np6.apps.googleusercontent.com',
        'clientSecret': 'JKXyzH30FrEe93cnYxd014kx',
        'callbackURL': "http://localhost:3000/auth/google/callback"
	}

};