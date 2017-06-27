var db = require('../config/database.js');
var bcrypt  = require('bcrypt-nodejs');

// Establish database connection
db.serialize(function() {
   // db.run("DROP TABLE events");
    db.run("CREATE TABLE IF NOT EXISTS events (name TEXT NOT NULL, description TEXT NOT NULL, ownerId INTEGER NOT NULL, id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS invites (eventId INTEGER NOT NULL, userId INTEGER NULL, inviteCode TEXT NULL)");
});

module.exports = {
    Event: class{
        constructor(name, description, ownerId){
            this.name = name;
            this.description = description;
            this.ownerId = ownerId;
        }

        save(){
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
        inviteCode = bcrypt.hashSync(eventId+email);
        console.log(inviteCode);
        db.run("INSERT INTO invites(eventId, inviteCode) VALUES(?, ?)", eventId, inviteCode);
        db.all("SELECT users.id from users WHERE users.email=?", email, function(err, rows){
            console.log(rows);
            var userId = rows[0].id;
            db.run("UPDATE invites SET userId=?, inviteCode=NULL WHERE invites.inviteCode=?", userId, inviteCode);
        });
    },
    findEventsByUser: function(userId, callback){
        db.run("SELECT * FROM users", function(err, rows){
            console.log('all rows');
            console.log(err);
            console.log(rows);
        });
        db.run("SELECT events.* FROM events, invites WHERE invites.userId=? AND events.id=invites.eventId", userId, function(err, rows){
            callback(err, rows);
        });
    }
}