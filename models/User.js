const usersCollection = require('../db').collection('users')                    // database object
const validator = require('validator');

let User = function(data) {
    this.data = data;
    this.errors = [];
};

User.prototype.cleanUp = function () {
    if(typeof(this.data.username) != 'string') {this.data.username = ''}
    if(typeof(this.data.password) != 'string') {this.data.password = ''}
    if(typeof(this.data.email) != 'string') {this.data.email = ''}

    // get rid of any bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function () {
    if(this.data.username === '') {this.errors.push('You must provide a username')}
    if(this.data.username !== '' && !validator.isAlphanumeric(this.data.username)) {this.errors.push('Username can only contain letters and numbers')}
    if(!validator.isEmail(this.data.email)) {this.errors.push('You must provide an email')}
    if(this.data.password === '') {this.errors.push('You must provide a password')}
    if(this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push('Password must be at least 12 characters')}
    if(this.data.password.length > 100) {this.errors.push('Password cannot exceed 100 characters')}
    if(this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push('Username must be at least 12 characters')}
    if(this.data.username.length > 100) {this.errors.push('Username cannot exceed 100 characters')}
}

User.prototype.login = function(callback) {
    this.cleanUp()
    usersCollection.findOne({username: this.data.username}, (err, attemptedUser) => {
        if(attemptedUser && attemptedUser.password === this.data.password) {
            callback('Congrats')
        } else {
            callback('Invalid username / pass')
        }
    })
}

User.prototype.register = function () {
    // step #1 Validate user data
    this.cleanUp()
    this.validate()
    // step #2 Only if there are no validation errors
    // then save user data into a database
    if(!this.errors.length) {
        usersCollection.insertOne(this.data)                            // CRUD - Create new document in DB with data without errors
    }
};

module.exports = User;