/* routes for Courses
   // Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
 */

 var express = require('express');
 // importing mongoose
 var mongoose = require("mongoose");

 var courseRoutes = express.Router();

 // importing course-api documents
 var course = require('../models').course;
 var review = require('../models').review;
 var user = require('../models').user;

 // wrapped mongoose db methods in my own promise-based modular methods
 var runFindQuery = require('../documentMethods').runFindQuery;
 var createNew = require('../documentMethods').createNew;
 var updateDoc = require('../documentMethods').updateDoc;

 // my own middleware to check if a req has auth'ed creds
 const permsCheck = require('../utils').permsCheck;
 // my own util, 'parses' the req.body and takes only the data that is needed
 // used after bodyParser but before validation
 const preUpdatePrep = require('../utils').preUpdatePrep;

// GET /api/courses 200 - Returns the Course "_id" and "title" properties
courseRoutes.get("/api/courses", function(req, res, next){
  // add auth/perms checks

  return runFindQuery(course, {}).then(result => {

      if (!result.status){
  			let err = result;
  			return next(err);
  		} else if (!result.doc) {
        let err = new Error('Sorry, no courses found');
        return next(err);
      } else {
        // returning only the Course "_id" and "title" properties
        const coursesArray = result.doc.map((item, index)=>{
          return {id: item._id, title: item._doc.title}
        });
        res.json(coursesArray);
        res.status(result.status);
      }
   }); // end runFindQuery
}); // end get /api/courses route


// GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
courseRoutes.get("/api/courses/:id", function(req, res, next){
  // add auth/perms checks
  // const testCourseId = "57029ed4795118be119cc440";
  const courseId = req.params.id;

  return runFindQuery(course, {_id: courseId}).then(result => {

      if (!result.status){
        let err = result;
        return next(err);
      } else if (!result.doc) {
        let err = new Error('Sorry, no course found by that id');
        return next(err);
      } else {
        // return all Course properties
        // TODO: and related documents for the provided course ID
        // use Mongoose population to load the related user and reviews documents.
  		  res.json(result.doc);
        res.status(result.status);
      }
   }); // end runFindQuery

}); // end get /api/courses/:id route

/* TODO: need a way to get review id's from a course's review array converted into an object
  // GET /api/course/:courseId/reviews 200
  // Returns all reviews for a specific course
  courseRoutes.get("/api/courses/:id/reviews", function(req, res, next){

  }); // end get /api/courses/:courseId/reviews route
*/

// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
courseRoutes.post("/api/courses",  permsCheck, function(req, res, next){

	if (req.body.title && req.body.description && req.body.steps) {

   var newCourseData = req.body;
   newCourseData.user = req.user;

   return createNew(course, newCourseData).then(result =>{

				if (!result.status) {
					return next(err);
				} else {
					// set status and location header to '/' and return no content
					res.status(result.status);
					res.setHeader('Location', '/');
          // without this express router will try to continue to process routes
          // which will result an a 404 route found error
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
}); // end /api/courses post create user route

// PUT /api/courses/:courseId 204 - Updates a course and returns no content
courseRoutes.put("/api/courses/:id",  permsCheck, function(req, res, next){

	if (req.body.title && req.body.description && req.body.steps) {

   var docId = req.params.id;
   var updateCourseData = preUpdatePrep(course, req.body);

   return updateDoc(course, docId, updateCourseData).then(result =>{

				if (!result.status) {
					return next(err);
				} else {
					// set status and location header to '/' and return no content
					res.status(result.status);
					res.setHeader('Location', '/');
          // without this express router will try to continue to process routes
          // which will result an a 404 route found error
					res.end();
				}

		}).catch(err => {
				return next(err);
		}); // end updateDoc

	} else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
  }
}); // end /api/courses post create user route

// POST /api/courses/:courseId/reviews 201
// Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
courseRoutes.post("/api/courses/:courseId/reviews",  permsCheck, function(req, res, next){

  if ( req.body) {

    return runFindQuery(course, {_id: req.params.courseId}).then(result =>{
        if (result.doc[0].user.equals(req.user._id)){
          var err = new Error('The user who owns the course, cannot review it.');
          err.status = 400;
          return next(err);
        } else {
            createNew(review, req).then(result =>{

              if (!result.status) {
                return next(err);
              } else {

                // now update course.review array with new review
                let docId = req.params.courseId;
                let updateDataObject = {_id:result.doc._id};
                let reviews = "reviews";

                updateDoc(course, {_id: docId}, updateDataObject, reviews).then(result =>{

             				if (!result.status) {
             					return next(err);
             				} else {
             					// set status and location header to '/' and return no content
             					res.status(result.status);
             					res.setHeader('Location', '/');
                       // without this express router will try to continue to process routes
                       // which will result an a 404 route found error
             					res.end();
             				}

             		}).catch(err => {
             				return next(err);
             		}); // end updateDoc

              } // end if (!result.status)

          });
        }
      }).catch(err => {
        return next(err);
    }); // end createNew review

  } else {
      var err = new Error('A review rating is required.');
      err.status = 400;
      return next(err);
  }

}); // end /api/courses/:courseId/reivews post create course review

module.exports = courseRoutes;
