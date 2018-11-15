/* User routes
   Set User routes HTTP VERB Route/Path HTTP Status Code):
*/

var express = require('express');
var userRoutes = express.Router();
// importing mongoose
var mongoose = require("mongoose");

// importing course-api documents
var course = require('../models').course;
var review = require('../models').review;
var user = require('../models').user;

// wrapped mongoose methods in my own promise-based modular methods
var runFindQuery = require('../documentMethods').runFindQuery;
var createNew = require('../documentMethods').createNew;

// GET /api/users 200 - Returns the currently authenticated user
userRoutes.get("/api/users", function(req, res, next){

	return runFindQuery(user, {}).then(result => {

		if (!result.status){
			let err = result;
			return next(err);
		} else {
			res.json(result.doc);
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

		return createNew(user, req.body).then(result =>{

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
