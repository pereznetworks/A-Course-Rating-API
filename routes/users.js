/* User routes
   Set User routes HTTP VERB Route/Path HTTP Status Code):
*/

var express = require('express');
var userRoutes = express.Router();

// importing course-api documents
var course = require('../models').course;
var review = require('../models').review;
var user = require('../models').user;

// GET /api/users 200 - Returns the currently authenticated user

userRoutes.get("/api/users", function(req, res, next){
  // add auth/perms checks
	user.find({}, function(err, doc){
		if(err){
       return next(err)
    } else if(!doc){
			err = new Error("No Users Found");
			err.status = 404;
			return next(err);
		}
    // TODO: return only the Course "_id" and "title" properties
		res.json(doc);
    res.status(200);
	});
});
// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

module.exports = userRoutes;
