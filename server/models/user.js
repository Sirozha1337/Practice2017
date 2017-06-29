"use strict";
var db = require('../config/database.js');
var bcrypt  = require('bcrypt-nodejs');

// Establish database connection
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS users (name TEXT NOT NULL, email TEXT NOT NULL, passwordHash TEXT NULL, id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL)");
});

module.exports = {
    // Save user model to database
    addUser: function(name, email, password, callback){
        var user = {};
        user.name = name;
        user.email = email;
        // If it was local-signup hash password
        if(password)
            user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        else
            user.password = null;
        db.run("INSERT INTO users(name, email, passwordHash) VALUES ('" + user.name + "','" + user.email + "','" + user.password + "')", 
            function(err){
                if(err){
                    console.log('Erorr saving user to database:' + err);
                }
                else{
                    user.id = this.lastID;
                    if(callback)
                        callback(user);
                }
        });
    },
    // Compare password to passwordHash
    validPassword: function(hash, password){
        if(hash != 'null')
            return bcrypt.compareSync(password, hash);
        else
            return false;
    },
    // find user in db by his email
    findUserByEmail: function (email, callback){
        db.all("SELECT * from users WHERE email=?", email, function(err, rows){
            if(err){
                console.log("Can't find user by email" + err);
                return callback(false);
            }
            if(rows.length == 0){
                return callback(false);
            }
            return callback(rows);
        });
    }
}
