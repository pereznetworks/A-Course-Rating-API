
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

/* Review schema requirements
    _id (ObjectId, auto-generated)
    user (_id from the users collection)
    postedOn (Date, defaults to “now”)
    rating (Number, required, must fall between “1” and “5”)
    review (String)

*/

module.exports = new Schema({
  id:  mongoose.Schema.Types.ObjectId,
  user: {type: [Schema.Types.ObjectId], required: [true, `This value should come from User._id`]},
  postedOn: {type: Date, default: Date.now},
  rating: {type: Number, required: true, min: [1, 'A minimum rating of 1 is required.'], max: [5, 'The highest rating possible is 5.'] },
  review: {type: String},

});
