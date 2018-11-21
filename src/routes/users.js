/* User routes
   Set User routes HTTP VERB Route/Path HTTP Status Code):
*/

var express = require('express');
var userRoutes = express.Router();
// importing mongoose
var mongoose = require("mongoose");

// importing course-api documents
var Course = require('../models').course;
var Review = require('../models').review;
var User = require('../models').user;

// wrapped mongoose methods in my own promise-based modular methods
// not used in user routes but might in the future
var runFindQuery = require('../documentMethods').runFindQuery;
var createNew = require('../documentMethods').createNew;

// my own middleware to check if a req has auth'ed creds
const permsCheck = require('../utils').permsCheck;

// GET /api/users 200 - Returns the currently authenticated user
userRoutes.get("/api/users", permsCheck, function(req, res, next){

	return runFindQuery(User, {_id: req.user._id.toString()}).then(result => {

		if (!result.status){
			let err = result;
			return next(err);
		} else {
			let user = [{fullName: result.doc[0].fullName, emailAddress: result.doc[0].emailAddress }]
			res.json(user);
			res.status(result.status);
		}

	}).catch(err => {
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

		return createNew(User, req.body).then(result =>{

				if (!result.status) {
					return next(err);
				} else {
					// set status and location header to '/' and return no content
					res.status(result.status);
					res.setHeader('Location', '/');
					// without res.end(), the express router will try to continue to process routes
					// which will result an a 404 route found error
					res.end();
				}

		}).catch(err => {
				return next(err);
		}); // end createNew

}); // end /api/users post create user route

module.exports = userRoutes;
