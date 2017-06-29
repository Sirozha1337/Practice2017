"use strict";
var db = require('../config/database.js');
var bcrypt = require('bcrypt-nodejs');
var mail = require('../config/mail.js');

// Establish database connection and create tables if needed
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS events (name TEXT NOT NULL, description TEXT NOT NULL, ownerId INTEGER NOT NULL, id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS invites (eventId INTEGER NOT NULL, userId INTEGER NULL, inviteCode TEXT NULL)");
});

var self = module.exports = {
    // Add new event to database
    addEvent: function(name, description, ownerId, callback){
        var event = {};
        event.name = name;
        event.description = description;
        event.ownerId = ownerId;
        db.run("INSERT INTO events(name, description, ownerId) VALUES(?, ?, ?)", 
                event.name, 
                event.description, 
                event.ownerId, 
                function(err){
                    if(err){
                        console.log('Error adding new event: ' + err);
                    }
                    else{
                        console.log('New event ID ' + this.lastID);
                        event.id = this.lastID;
                        callback(event);
                    }
        });
    },
    // Get users, who are invited to this event
    findUsersByEvent: function (eventId, callback){
        db.all("SELECT users.* from users INNER JOIN invites ON users.id=invites.userId WHERE eventId=? UNION SELECT users.* FROM users, events WHERE users.id=events.ownerId AND events.id=?", eventId, eventId, function(err, rows){
            if(err){
                console.log('Error finding users in this event:' + err);
                return callback(false);
            }
            return callback(rows);
        });
    },
    // Invite user by email
    createInvite: function(eventId, email){
        /* Create invite code */
        var inviteCode = bcrypt.hashSync(eventId+email);

       
        /* Save invitation to database */
        db.run("INSERT INTO invites(eventId, inviteCode) VALUES(?, ?)", eventId, inviteCode);

        /* Check if the user with this email already registered and activate this invite */
        db.all("SELECT users.id from users WHERE users.email=?", email, function(err, rows){
            if(rows.length > 0){
                var userId = rows[0].id;
                self.addUserToEvent(userId, inviteCode);
            }
            else{
                /* Get mailing options */
                var ops = mail.mailOptions;
                ops.to = email;
                ops.text = 'http://localhost:3000/?invite=' + inviteCode;
                console.log(ops);

                /* Send invitation email */
                mail.mailer.sendMail(ops, function(err, inf){
                    if(err)
                        console.log('Error sending email:' + err);
                });
            }
        });
    },
    // Redeem invite code for specified user
    addUserToEvent: function(userId, inviteCode){
       db.run("UPDATE invites SET userId=?, inviteCode=NULL WHERE invites.inviteCode=?", userId, inviteCode, 
       function(err, rows){
            if(err)
                console.log('Error redeeming the invite:' + err);
       }); 
    },
    // Get a list of events this user has access to
    findEventsByUser: function(userId, callback){
        db.all("SELECT events.* FROM events INNER JOIN invites ON events.id=invites.eventId WHERE invites.userId=? UNION SELECT * FROM events WHERE events.ownerId=? ORDER BY events.id DESC", userId, userId, function(err, rows){
            if(err)
                console.log('Error getting events for user:' + err);
            callback(rows);
        });
    }
}
