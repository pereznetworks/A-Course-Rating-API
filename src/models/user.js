
/* define schemas */

'use strict';
// importing mongoose.Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// using bcrypt to to encrypt the passwords
var bcrypt = require('bcrypt');

// using Validator.js to validate email address
// may use for others as well
var isEmail = require('validator').isEmail;

/* User schema requirements
    _id (ObjectId, auto-generated)
    fullName (String, required)
    emailAddress (String, required, must be unique and in correct format)
    password (String, required)
*/

const userSchema = new Schema({


    id: {
          type: mongoose.Schema.Types.ObjectId
        },
    fullName: {
                        type: String,
                    required: [true, 'Please enter the first and last name of the user.']
              },
    emailAddress: {
                        type: String,
                    required: [true, 'Please type the email address of the user'],
                      unique: [true, 'That email address is already associated with another user account.'],
                    validate: { validator: isEmail , message: `Please type a valid email address.` }
                  },
    password: {
                        type: String,
                    required: [true, 'A password is required'],
                       index: true
              }
});

// authenticate input against database documents
// since this is a method on the user schema, not using modular document methods here
userSchema.statics.authenticate = function(email, password, callback) {
  var user = this;
  user.findOne({ email: email })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('Email or Password invalid');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            var err = new Error('Email or Password invalid');
            err.status = 401;
            return callback(err);
          }
        })
      });
}

// hash password before saving to database
userSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

module.exports = userSchema;
