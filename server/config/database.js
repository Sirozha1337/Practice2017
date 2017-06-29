// Database configuration
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./users.db');

module.exports = db;