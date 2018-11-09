/* mongo db document methods
  // methods for creating, updating, deleting, querying db.Users
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");


// // importing course-api documents
// var course = require('../data/models').course;
// var review = require('../data/models').review;
// var user = require('../data/models').user;

const runFindQuery = function(documentToDoQuery, queryObject){

  return new Promise(resolve => {
    documentToDoQuery.find(queryObject, function(err, user){
      if(err){
        resolve(err);
      } else if(!user){
        const err = new Error("Oops, no user found");
        err.status = 404;
        resolve(err);
      } else {
        const result = {user: user, status: 200};
        resolve(result);
      }
    });
  })
};

module.exports = runFindQuery;
