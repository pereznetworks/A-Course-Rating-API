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

// GET /api/courses 200 - Returns the Course "_id" and "title" properties

courseRoutes.get("/api/courses", function(req, res, next){
  // add auth/perms checks

	course.find({}, function(err, courses){
		if(err){
       return next(err)
    }
		if(!courses) {
      let err = new Error('Sorry, no courses found');
			return next(err);
		} else {
      // returning only the Course "_id" and "title" properties
      const coursesArray = courses.map((item, index)=>{
        return {id: item._id, title: item._doc.title}
      })
  		res.json(coursesArray);
      res.status(200);
    }
	});
});

// GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
courseRoutes.get("/api/courses/:id", function(req, res, next){
  // add auth/perms checks
  const testCourseId = "57029ed4795118be119cc440";
  const courseId = req.params.id;
	course.findById(req.params.id, function(err, course){
		if(err){
       return next(err)
     };
    if(!course) {
      let err = new Error('Sorry, no course found by that id');
      return next(err);
		} else {
      // return all Course properties
      // TODO: and related documents for the provided course ID
      // use Mongoose population to load the related user and reviews documents.
		  res.json(course);
      res.status(200);
    }
	});
});


// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content

// PUT /api/courses/:courseId 204 - Updates a course and returns no content

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content

module.exports = courseRoutes;
