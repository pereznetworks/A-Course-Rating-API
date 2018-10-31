/* define schemas and data models */

'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/*
  User
    _id (ObjectId, auto-generated)
    fullName (String, required)
    emailAddress (String, required, must be unique and in correct format)
    password (String, required)
*/

var UserSchema = new Schema({
    fullName: {type: String, required: true}
    emailAddress: {type: String, required: true}
    password: {type: String, required: true}
});

/*
  Course
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
  user: UserSchema.id,
  title: {type: String, required: true}
  description: {type: String, required: true}
  estimatedTime: String,
  materialsNeeded: String,
  steps: [
            {
              stepNumber: Number,
              title: {type: String, required: true},
              description: {type: String, required: true}
            }
          ],
  reviews: [ReviewSchema]
});

/*
  Review
    _id (ObjectId, auto-generated)
    user (_id from the users collection)
    postedOn (Date, defaults to “now”)
    rating (Number, required, must fall between “1” and “5”)
    review (String)

*/

var ReviewSchema = new Schema({
  user: UserSchema.id,
  postedOn: {type: Date, default: Date.now},
  rating: {type: Number, required: true, min: [1, 'A min of 1 is required.'], max: [5, 'The highest rating possible is 5.'] }
});


var User = mongoose.model("User", UserSchema);
var Course = mongoose.model("Course", CourseSchema);
var Review = mongoose.model("Review", ReviewSchema);

module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;
