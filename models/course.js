
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

/* Course schema requirements
    _id (ObjectId, auto-generated)
    user (_id from the users collection)
    title (String, required)
    description (String, required)
    estimatedTime (String)
    materialsNeeded (String)
    steps (Array of objects that include:[ stepNumber (Number), title (String, required) and description (String, required) properties)]
    reviews (Array of ObjectId values: [_id values from the reviews collection])
*/

module.exports.courseSchema = new Schema({

  id: Schema.Types.ObjectId,
  user: {
                    type: Schema.Types.ObjectId,
                     ref: 'User',
                required: [true, `Oops, no user is associated wth this Course`]
         },
  title: {
                    type: String,
                required: [true, `Please type a title for the course.`]
         },
  description: {
                    type: String,
                required: [true, `Please type a description for the course.`]
               },
  estimatedTime: String,
  materialsNeeded: String,
  steps: [
            {
              stepNumber: Number,
              title: {
                              type: String,
                          required: [true, `Please type a title for this step of the course.`]
                     },
              description: {
                              type: String,
                          required: [true, `Please type a description for this step of the course.`]}
            }
          ],
  reviews: [
              {type: Schema.Types.ObjectId,
                ref: 'User'
              }
            ]
});
