
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

module.exports.userSchema = new Schema({

    id: Schema.Types.ObjectId,
    fullName: {
                        type: String,
                    required: [true, `Please type user's full name.`],
                        trim: true
              },
    emailAddress: {
                        type: String,
                    required: true,
                      unique: true,
                       index: true,
                    // validate: { validator: isEmail , message: 'Please type a valid email address.' }
                  },
    password: {
                        type: String,
                    required: true,
                       index: true
              }
});
