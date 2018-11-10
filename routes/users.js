/* User routes
   Set User routes HTTP VERB Route/Path HTTP Status Code):
*/

var express = require('express');
var userRoutes = express.Router();
// importing mongoose
var mongoose = require("mongoose");

// importing course-api documents
var course = require('../data/models').course;
var review = require('../data/models').review;
var user = require('../data/models').user;

// wrapped mongoose methods in my own promise-based modular methods
var runFindQuery = require('../data/documentMethods').runFindQuery;
var createNew = require('../data/documentMethods').createNew;

// GET /api/users 200 - Returns the currently authenticated user
userRoutes.get("/api/users", function(req, res, next){
  // add auth check
	// TODO: use router.param and auth middleware method and...
	// TODO: for logged in user will send req.session.userId
	// can simulate a logged in user
	// testUserId = {id: 57029ed4795118be119cc437}
	// no auth/sessions setup yet, just gets all users...

	return runFindQuery(user, {}).then(result => {

		if (!result.status){
			let err = result;
			return next(err);
		} else {
			res.json(result.user);
			res.status(result.status);
		}

	}).catch(err => {
			res.status(400)
			res.json({
				message: err.message,
				error: err.status,
				details: err.stack
			});
			return next(err);
	}); // end runFindQuery

}); // end /api/users route

/* TODO: IDEA: router.param AUTH middleware,
	 will need to validate the password and encrypt it
	   before getting to /api/users post route
	 also will need to encrypt all the passwords
	   in the user accounts from seed-data also
 */

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
// this requires the user info be sent as properties in req.body object
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

		/* future section for parsing and validating ??
			// var emailAddress = req.body.emailAddress.toString();
			// var fullName = req.body.fullName.toString();
			// var password = req.body.password.toString();
		*/

		return createNew(user, req.body).then(result =>{

				if (!result.status) {
					return next(err);
				} else {
					// set status and location header to '/' and return no content
					res.status(result.status);
					res.setHeader('Location', '/');
					res.end();
				}

		}).catch(err => {
				return next(err);
		}); // end createNew

	} else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
  }
}); // end /api/users post create user route

module.exports = userRoutes;
