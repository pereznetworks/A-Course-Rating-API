'use strict';

// importing mongoose
var mongoose = require("mongoose");
const env = process.env.NODE_ENV || 'development';

// importing course-api documents/collections
var Course = require('../models').course;
var User = require('../models').user;
var Review = require('../models').review;

const cleanDb = function(){

  if(env === 'development'){

    // my own modular mongoose connection method and callbacks
    const connect = require('../utils').connect;
    const onErr = require('../utils').onErr;
    const onceConnected = require('../utils').onceConnected;

    // connecting to mongodb...
    const db = connect();

    // if error in connection...
    db.on("error", function(err){
    	onErr(err);
    });

    // if connected and all is good...
    db.once("open", function(){
    	onceConnected();
    });

    console.log('deleting course, user and review data');

    Course.deleteMany({}).then(function (doc) {
      console.log(`removed all courses\n`);
    }).then(function(){
      User.deleteMany({}).then(function (doc) {
        console.log(`removed all users..\n`);
        }).catch(function (err) {
          console.log(err);
          console.log('CTRL-C to exit');
        });
    }).then(function(){
      Review.deleteMany({}).then(function (doc) {
        console.log(`removed all reviews\n`);
        console.log('to insert a fresh copy of sample reviews data...\n');
        console.log('run npm start, with NODE_ENV set to `development`\n');
        console.log('CTRL-C to exit');
        }).catch(function (err) {
          console.log(err);
          console.log('CTRL-C to exit');
        });
    }).catch(function (err) {
      console.log(err);
      console.log('CTRL-C to exit');
    });

  } else {

    console.log('sorry, this utility is only for development mode\n');
    console.log('CTRL-C to exit');

  }
};

module.exports.cleanDb = cleanDb();
