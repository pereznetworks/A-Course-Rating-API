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
	user.findById(loggedInUserId, function(err, user){
		if(err){
       return next(err)
    } else if(!user){
			err = new Error("Oops, no user found");
			err.status = 404;
			return next(err);
		}
    // TODO: return the authenticated user's entire profile...?
		res.json(user);
    res.status(200);
	});
});

/* TODO: IDEA: router.param AUTH middleware,
	 will need to validate the password and encrypt it
	   before getting to /api/users post route
	 also will need to encrypt all the passwords
	   in the user accounts from seed-data also
 */

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
// this requires the user info be sent as properties in req.body, like from an html form
userRoutes.post("/api/users", function(req, res, next){

	if (req.body.fullName &&
		req.body.emailAddress &&
		req.body.password &&
		req.body.confirmPassword) {

		// confirm that user typed same password twice
		if (req.body.password !== req.body.confirmPassword) {
			var err = new Error('Passwords do not match.');
			err.status = 400;
			return next(err);
		}

		// create an object with form input
		var newUser = {
			emailAddress: req.body.email,
			fullName: req.body.name,
			password: req.body.password
		};

		// creating the new user
		// TODO: will create method auto set an _id...?
		user.create(newUser, function (error, user) {
			if (error) {
				return next(error);
			} else {
				// set location header to '/' and return no content
				res.status(201)
				res.setHeader('Location', '/');

			}
		});
	} else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
  }
}); // end /api/users post create user route

module.exports = userRoutes;
