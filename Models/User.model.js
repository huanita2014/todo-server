const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    todos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}]
});


//Password hashing before save
User.pre('save', function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if(err) {
            return next(err);
        }
        this.password = passwordHash;
        next();
    });
});

User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err) {
            return cb(err);
        } else {
            if(!isMatch) {
                return cb(null, isMatch);
            }
            return cb(null, this);
        }
    });
}

module.exports = mongoose.model('User', User);