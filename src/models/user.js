
/* define schemas */

'use strict';
// importing mongoose.Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// using bcrypt to to encrypt the passwords
// var bcrypt = require('bcrypt');

// using Validator.js to validate email address
// may use for others as well
var isEmail = require('validator').isEmail;

/* User schema requirements
    _id (ObjectId, auto-generated)
    fullName (String, required)
    emailAddress (String, required, must be unique and in correct format)
    password (String, required)
*/

module.exports = new Schema({


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
