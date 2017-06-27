var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./users.db');

// Establish database connection
db.serialize(function() {
   // db.run("DROP TABLE users");
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
    }
}