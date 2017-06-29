// Authentication configuration
module.exports = {
	'facebookAuth' : {
		'clientID' 		: '120396248563743', 
		'clientSecret' 	: '4d8b26c929ddbaa41eed8413344900e9', 
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},
	
	'googleAuth' : {
		'clientID': '1018548991256-ms5rl6vtkhiere25kgfpflo2jp1b7np6.apps.googleusercontent.com',
		'clientSecret': 'JKXyzH30FrEe93cnYxd014kx',
		'callbackURL': "http://localhost:3000/auth/google/callback"
	}
};