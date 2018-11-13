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
courseRoutes.post("/api/courses", function(req, res, next){

	if ( req.body.user && req.body.title & req.body.description && req.body.steps) {

    /* future section for parsing and validating ??
      // var userId = req.body.userId.toString();
      // var title = req.body.title.toString();
      // var description = req.body.description.toString();
      // var estimatedTime = req.body.estimatedTime.toString();
      // var materialsNeeded = req.body.materialsNeeded.toString();
      // var steps = req.body.steps.toString();
    */

	 return createNew(course, req.body).then(result =>{

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
courseRoutes.put("/api/courses/:id", function(req, res, next){

	if ( req.body.user &&	req.body.title && req.body.description && req.body.steps) {

    /* future section for parsing and validating ??
      // var userId = req.body.userId.toString();
      // var title = req.body.title.toString();
      // var description = req.body.description.toString();
      // var estimatedTime = req.body.estimatedTime.toString();
      // var materialsNeeded = req.body.materialsNeeded.toString();
      // var steps = req.body.steps.toString();
    */

   var docId = req.params.id;
   var updateDataObject = req.body;
	 return updateDoc(course, docId, updateDataObject).then(result =>{

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
courseRoutes.post("/api/courses/:courseId/reviews", function(req, res, next){

  /*  creating a new review...
        verify that new review gets...
          user.Id
          a date posted
          rating
          and a optional text

      updating course.reviews array should occur auto'ly via schema

      the user_id for the review should be the user posting the review

      so the user_id will be the id logged in user
      will have implement auth/permisisions before testing getting a course reviews
  */

  if ( req.body) {

    // get data values
      let objectDataValues = {
          user: req.body.user,  // once auth is implemented, will need to change this
          reviewRating: req.body.rating,
          reviewText: req.body.review
      };

    /* future section for auth check, parsing and validating ??
      // var rating = req.body.userId;
      // var reviewText = req.body.review.toString();
    */

   return createNew(review, req.body).then(result =>{

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

        } // end if (req.body)



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
