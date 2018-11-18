/* import schemas and declare models */

'use strict';
// importing mongoose
var mongoose = require("mongoose");

// importing schema
var courseSchema = require('./course.js');
var reviewSchema = require('./review.js');
var userSchema = require('./user.js');

// creating the documents/collections
const Course = mongoose.model('course', courseSchema);
const Review = mongoose.model('review', reviewSchema);
const User = mongoose.model('user', userSchema);

// exporting the documents
module.exports.course = Course;
module.exports.review = Review;
module.exports.user = User;
