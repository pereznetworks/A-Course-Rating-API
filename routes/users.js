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
  // add auth check
	// simulating a logged in user
	// TODO: use router.param and auth middleware method and...
	// TODO: for logged in user will send req.session.userId
	loggedInUserId = '57029ed4795118be119cc437'
	user.find({}, function(err, user){
		if(err){
       return next(err)
    } else if(!user){
			err = new Error("Oops, no user found");
			err.status = 404;
			return next(err);
		}
    // TODO: return the authenticated user's profile or just name of
		res.json(user);
    res.status(200);
	});
});
// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

module.exports = userRoutes;
