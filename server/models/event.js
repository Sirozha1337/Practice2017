"use strict";
var db = require('../config/database.js');
var bcrypt = require('bcrypt-nodejs');
var mail = require('../config/mail.js');
// Establish database connection
db.serialize(function() {
  //  db.run("DROP TABLE events");
  //  db.run("DROP TABLE invites");
    db.run("CREATE TABLE IF NOT EXISTS events (name TEXT NOT NULL, description TEXT NOT NULL, ownerId INTEGER NOT NULL, id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS invites (eventId INTEGER NOT NULL, userId INTEGER NULL, inviteCode TEXT NULL)");
});

var self = module.exports = {
    Event: class{
        constructor(name, description, ownerId){
            this.name = name;
            this.description = description;
            this.ownerId = ownerId;
        }

        save(callback){
            var event = this;
            db.run("INSERT INTO events(name, description, ownerId) VALUES(?, ?, ?)", 
                this.name, 
                this.description, 
                this.ownerId, 
                function(err){
                    if(err){
                        console.log('DB error : ' + err);
                    }
                    else{
                        console.log('New event ID ' + this.lastID);
                        event.id = this.lastID;
                        callback(event);
                    }
            });
        }
    },
    findEventsByOwner: function (ownerId, callback){
        db.all("SELECT * from events WHERE ownerId = ?", ownerId, function(err, rows){
            if(err){
                console.log(err);
                return callback(false);
            }
            if(rows.length == 0){
                console.log('no events');
                return callback(false);
            }
            return callback(rows);
        });
    },
    findUsersByEvent: function (eventId, callback){
        db.all("SELECT users.* from users INNER JOIN invites ON users.id=invites.userId WHERE invites.eventId=?", eventId, function(err, rows){
            if(err){
                console.log(err);
                return callback(false);
            }
            if(rows.length == 0){
                console.log('no events');
                return callback(false);
            }
            return callback(rows);
        });
    },
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
    addUserToEvent: function(userId, inviteCode){
       db.run("UPDATE invites SET userId=?, inviteCode=NULL WHERE invites.inviteCode=?", userId, inviteCode, 
       function(err, rows){
            if(err)
                console.log('Error redeeming the invite:' + err);
       }); 
    },
    findEventsByUser: function(userId, callback){
        db.all("SELECT events.* FROM events INNER JOIN invites ON events.id=invites.eventId WHERE invites.userId=? UNION SELECT * FROM events WHERE events.ownerId=? ORDER BY events.id DESC", userId, userId, function(err, rows){
            if(err)
                console.log('Error getting events for user:' + err);
            callback(rows);
        });
    }
}
