//from lecture
const db = require('./DBConnection');
const User = require('./models/User');
const crypto = require('crypto');

function getUserByCredentials(username, password) {
  return db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(({results}) => {
    const user = new User(results[0]);
    if (user) { // we found our user
      return user.validatePassword(password);
    }
    else { // if no user with provided username
      throw new Error("No such user");
    }
  });
}

function createUser(username, password, first_name, last_name) {
  return db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(({results}) => {
    if (results.length > 0) { // we already have this user
      throw new Error("User already exists");
    }
    // new user (good)
    //create a salt
    const salt = crypto.randomBytes(25).toString('base64');

    //salt and hash the password
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) { //problem computing digest, like hash function not available
        res.status(400).json({error: err});
      }
      const hashedPassword = derivedKey.toString('hex');

      return db.query('INSERT INTO user (usr_first_name, usr_last_name, usr_username, usr_password, usr_salt) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, username, hashedPassword, salt]).then(({results}) => {
        return getUser(results.insertId);
      });
    });

    
    
  });
}

function getUsers() {
  return db.query('SELECT * FROM user').then(({results}) => {
    return results.map(user => new User(user)); ;
  });
}

function getUser(userId) {
  return db.query('SELECT * FROM user WHERE usr_id=?', [userId]).then(({results}) => {
    const user = new User(results[0]);
    if (user) { // we found our user
      return user.toJSON();
    }
    else { // if no user with provided username
      
      throw new Error("No such user");
    }
  });
}


module.exports = {
  getUserByCredentials: getUserByCredentials,
  getUsers: getUsers,
  getUser: getUser,
  createUser: createUser,
};
