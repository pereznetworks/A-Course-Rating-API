/* routes for Courses
   // Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
 */

 var express = require('express');
 // importing mongoose
 var mongoose = require("mongoose");

 var courseRoutes = express.Router();

 // importing course-api documents
 var Course = require('../models').course;
 var Review = require('../models').review;
 var User = require('../models').user;

 // wrapped mongoose methods in my own promise-based modular methods
 var runFindQuery = require('../documentMethods').runFindQuery;
 var createNew = require('../documentMethods').createNew;
 var updateDoc = require('../documentMethods').updateDoc;


 // my own middleware to check if a req has auth'ed creds
 const permsCheck = require('../utils').permsCheck;

 // my own util, 'parses' the req.body and takes only the data that is needed
 // used after bodyParser but before model validation
 const preUpdatePrep = require('../utils').preUpdatePrep;

// GET /api/courses 200 - Returns the Course "_id" and "title" properties
courseRoutes.get("/api/courses", function(req, res, next){

  Course.find({}, function(err, result){

      if (err){
        // this will ussually be a validation error
  			next(err);
  		} else if (!result) {
        // this will ussually not be an error..
        // valid courseId format, but just 'not found'
        let err = new Error('Sorry, no courses found');
        err.status = 404;
        next(err);
      } else {
        // returning only the Course "_id" and "title" properties
        const coursesArray = result.map((item, index)=>{
          return {id: item._id, title: item._doc.title}
        });
        // return list of course title and id's
        res.json(coursesArray);
        res.status(result.status);
        res.end();
      }
   }); // end runFindQuery
}); // end get /api/courses route


// GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
courseRoutes.get("/api/courses/:id", function(req, res, next){
  // add auth/perms checks
  // const testCourseId = "57029ed4795118be119cc440";
  const courseId = req.params.id;

  Course.findById(courseId).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "fullName"
      }
    }).exec(function(err, doc){
    if(err){
      // this will ussually be a populate, or invalid courseId, error
      next(err);
    } else if(!doc){
      // this will ussually not be an error..
      // courseId valid format, but just a 'not found'
      const err = new Error(`Oops, we did not find that course.`);
      err.status = 404;
      next(err);
    } else {
      // the .populate method replaces the reviewid's with...
      // the review rating, review text, and the reviewer's user id and name
      const result = {doc: doc, status: 200};
      res.json(result.doc);
      res.status(result.status);
      res.end();
    }
  });

}); // end get /api/courses/:id route

// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
courseRoutes.post("/api/courses",  permsCheck, function(req, res, next){
  // testing for these req.body properties here
	if (req.body.title && req.body.description && req.body.steps) {
   // to assign these as part of one object here
   var newCourseData = req.body;
   newCourseData.user = req.user;

    // create an object with form input
    Course.create(newCourseData, function (err, doc) {
        if (err) {
          // this is ussually a validation error
          next(err);
        } else {
    			// set status and location header to '/' and return no content
					res.status(201);
					res.setHeader('Location', '/');
					res.end();
        }
    });

	} else {
      var err = new Error('All fields required.');
      err.status = 400;
      next(err);
  }
}); // end /api/courses post create user route

// PUT /api/courses/:courseId 204 - Updates a course and returns no content
courseRoutes.put("/api/courses/:id",  permsCheck, function(req, res, next){

   var docId = req.params.id;
   var updatedCourseData = preUpdatePrep(Course, req.body);

   Course.findByIdAndUpdate({_id: docId}, updatedCourseData, {new:true, runValidators:true},function (err, doc) {
       // another condition test here because of ...
       if (err) {
         next(err);
       } else {
         // doc.save(function(err) {
         //   if (err) {
         //     next(err);
         //   }
         // });
         // set status and location header to '/' and return no content
         res.status(201);
         res.setHeader('Location', '/');
         // without this express router will try to continue to process routes
         // which will result an a 404 route found error
         res.end();
       }
   });
}); // end /api/courses post create user route

// POST /api/courses/:courseId/reviews 201
// Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
courseRoutes.post("/api/courses/:courseId/reviews",  permsCheck, function(req, res, next){

  if ( req.body.rating) { // testing for at least a rating property

    // not using my documentMethods elsewhere...
    // due to query.select and deep populate methods not working...
    // but this works fine and...
    // this promise-based layered approach makes this less likely to produce errors
    return runFindQuery(Course, {_id: req.params.courseId}).then(result =>{
        if (result.doc[0].user.equals(req.user._id)){
          var err = new Error('The user who owns the course, cannot review it.');
          err.status = 400;
          return next(err);
        } else {
            createNew(Review, req).then(result =>{

              if (!result.status) {
                return next(err);
              } else {

                // now update course.review array with new review
                let docId = req.params.courseId;
                let updateDataObject = {_id:result.doc._id};
                let reviews = "reviews";

                updateDoc(Course, {_id: docId}, updateDataObject, reviews).then(result =>{

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
             		}); // end update course with review id

              } // end if (!result.status)

          }).catch(err => {
             return next(err);
          }); // end update course with review id; // end create new review
        } // end if (current user is course owner)
      }).catch(err => {
        return next(err);
    }); // end createNew review

  } else {
      var err = new Error('A review rating is required.');
      err.status = 400;
      return next(err);
  } // end if (req.body)

}); // end /api/courses/:courseId/reivews post create course review

module.exports = courseRoutes;
