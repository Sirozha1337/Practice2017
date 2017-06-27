var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./users.db');
var bcrypt  = require('bcrypt-nodejs');

// Establish database connection
db.serialize(function() {
   // db.run("DROP TABLE users");
    db.run("CREATE TABLE IF NOT EXISTS users (name TEXT NOT NULL, email TEXT NOT NULL, passwordHash TEXT NULL, id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL)");
});

module.exports = {
    // Class representing the user
    User: class{
        constructor(name, email, password){
            this.name = name;
            this.email = email;
            var user = this;
            if(password !== undefined)
                this.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            else
                this.passwordHash = null;
        }

        // Save user model to database
        save(){
            var user = this;
            db.run("INSERT INTO users(name, email, passwordHash) VALUES ('" + this.name + "','" + this.email + "','" + this.passwordHash + "')", 
                function(err){
                    if(err){
                        console.log('DB error');
                    }
                    else{
                        console.log('New user ID ' + this.lastID);
                        user.id = this.lastID;
                    }
            });
        }

    },
    validPassword: function(hash, password){
            console.log(bcrypt.compareSync(password, hash));
            return bcrypt.compareSync(password, hash);
    },
    // find user in db by his email
    findUserByEmail: function (email, callback){
        db.all("SELECT * from users WHERE email = ?", email, function(err, rows){
            if(err){
                console.log(err);
                return callback(false);
            }
            if(rows.length == 0){
                console.log('no user');
                return callback(false);
            }
            return callback(rows);
        });
    }
}