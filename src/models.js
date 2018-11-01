/* define schemas and declare models */

'use strict';
// importing mongoose.Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//using bcrypt to to encrypt the passwords
var bcrypt = require('bcrypt');

// using Validator.js to validate email address
// may use for others as well
var isEmail = require('validator').isEmail;

/* SCHEMAS */

/*
  User schema requirements
    _id (ObjectId, auto-generated)
    fullName (String, required)
    emailAddress (String, required, must be unique and in correct format)
    password (String, required)
*/

var UserSchema = new Schema({
    fullName: {type: String, required: [true, `Please type user's full name.`], trim: true},
    emailAddress: {
                    type: String,
                    required: [true, `Please type user's email address.`],
                    unique: true,
                    trim: true,
                    validate: { validator: isEmail , message: 'Please type a valid email address.' }
                  },
    password: {type: String, required: true}
});

/*
  Course schema requirements
    _id (ObjectId, auto-generated)
    user (_id from the users collection)
    title (String, required)
    description (String, required)
    estimatedTime (String)
    materialsNeeded (String)
    steps (Array of objects that include:[ stepNumber (Number), title (String, required) and description (String, required) properties)]
    reviews (Array of ObjectId values: [_id values from the reviews collection])
*/

var CourseSchema = new Schema({
  user: {type: [Schema.Types.ObjectId], required: [true, `This value should come from User._id`]},
  title: {type: String, required: [true, `Please type a title for the course.`]},
  description: {type: String, required: [true, `Please type a description for the course.`]},
  estimatedTime: String,
  materialsNeeded: String,
  steps: [
            {
              stepNumber: Number,
              title: {type: String, required: [true, `Please type a title for this step of the course.`]},
              description: {type: String, required: [true, `Please type a description for this step of the course.`]}
            }
          ],
  reviews: [{type: [Schema.Types.ObjectId]}]
});

/*
  Review schema requirements
    _id (ObjectId, auto-generated)
    user (_id from the users collection)
    postedOn (Date, defaults to “now”)
    rating (Number, required, must fall between “1” and “5”)
    review (String)

*/

var ReviewSchema = new Schema({
  user: {type: [Schema.Types.ObjectId], required: [true, `This value should come from User._id`]},
  postedOn: {type: Date, default: Date.now},
  rating: {type: Number, required: true, min: [1, 'A minimum rating of 1 is required.'], max: [5, 'The highest rating possible is 5.'] },
  review: {type: String},

});

/* Models */

var User = mongoose.model("User", UserSchema);
var Course = mongoose.model("Course", CourseSchema);
var Review = mongoose.model("Review", ReviewSchema);

module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;
