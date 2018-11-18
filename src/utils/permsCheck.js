/* Set up permissions to require users to be signed in
    will be adding to and require permissions on the following routes:
      POST /api/courses
      PUT /api/courses/:courseId
      GET /api/users
      POST /api/courses/:courseId/reviews
*/
// npm module to parse http req auth header
var auth = require('basic-auth');

// mongoose user model to access authentication method
var user = require('../models').user;

const permsCheck = function (req, res, next){

    // parse the `Authorization' header into the user's credentials.
    var creds = auth(req);

      // If the no creds found in req auth header...
      if (!creds) {

      // yup, using regexp to match originalUrl string...
      var newCourseUrlPattern = /\/api\/courses$/g;
      var updateCourseUrlPattern = /\/api\/courses[a-z0-9]+$/g;
      var reviewCourseUrlPattern = /\/api\/courses\/[a-z0-9]+\/reviews$/g;
      var getUsersUrlPattern = /\/api\/users$/g;

      // test the req method and originalUrl and
      // then pass the appropriate err to the next function
      if (req.method === 'POST' && newCourseUrlPattern.test(req.originalUrl)) {
        var err = new Error('You must be logged to create a new course.');
        err.status = 401;
        return next(err);
      } else if (req.method === 'PUT' && updateCourseUrlPattern.test(req.originalUrl)) {
        var err = new Error('You must be logged to update a new course.');
        err.status = 401;
        return next(err);
      } else if (req.method === 'POST' && reviewCourseUrlPattern.test(req.originalUrl)) {
        var err = new Error('You must be logged to review a course.');
        err.status = 401;
        return next(err);
      } else if (req.method === 'GET' && getUserUrlPattern.test(req.originalUrl)) {
        var err = new Error('Your not logged in.');
        err.status = 401;
        return next(err);
      }

    } else {
      // okay, so there are creds..but are the really auth'ed ?
      // use the user schema authenticate static method to check the supplied creds
      // check the credentials against the database
      user.authenticate(creds.email, creds.pass, function (err, userDoc) {
        if (err || !userDoc) {
          // if no user and there is an error
          // then pass the error to the next function
          var err = new Error('Email or password are invalid');
          err.status = 401;
          return next(err);
        }  else {
          // If the authenticate method returns the user doc...
          // then creds are the real deal...
          // set the user document on the request
          req.user = userDoc;
          return next();
        }
      });
   }
};

module.exports = permsCheck;
