/* import schemas and declare models */

'use strict';
// importing mongoose
var mongoose = require("mongoose");

// importing schema
var courseSchema = require('./course.js');
var reviewSchema = require('./review.js');
var userSchema = require('./user.js');

// creating the documents/collections
const course = mongoose.model('course', courseSchema);
const review = mongoose.model('review', reviewSchema);
const user = mongoose.model('user', userSchema);

// exporting the documents
module.exports.course = course;
module.exports.review = review;
module.exports.user = user;
