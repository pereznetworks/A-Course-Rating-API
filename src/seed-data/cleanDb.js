'use strict';

// importing mongoose
var mongoose = require("mongoose");
const env = process.env.NODE_ENV || 'development';

// importing course-api documents/collections
var Course = require('../models').course;
var User = require('../models').user;
var Review = require('../models').review;

  if(env === 'development'){

    console.log('deleting course, user and review data');

    Course.deleteMany({});
    User.deleteMany({});
    Review.deleteManay({})

    console.log('to insert a fresh copy of the data...\n');
    console.log('run npm start, with NODE_ENV set to `development`\n');

  } else {

    console.log('sorry, this utility is only for development mode');

  }
