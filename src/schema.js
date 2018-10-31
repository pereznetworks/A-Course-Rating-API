/* Schema */

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
    fullName: String,
    emailAddress: String,
    password: String
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
  user: [UserSchema.id],
  title: String,
  description: String,
  estimatedTime: String,
  materialsNeeded: String,
  steps: [{stepNumber: Number, title: String, description: String}],
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

var Review = new Schema({
  user: [UserSchema.id],
  postedOn: {type: Date, default: Date.now},
  rating: {type: Number, //range : 1 - 5 }
});
