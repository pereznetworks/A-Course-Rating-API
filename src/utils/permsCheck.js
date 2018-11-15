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

    // use the user schema authenticate static method to check the supplied creds
    if (!creds) {
      // If the authenticate method returns an error...
      // then pass it to the next function
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    } else {
      // check the credentials against the database
      user.authenticate(creds.email, creds.pass, function (err, userDoc) {
        if (err || !userDoc) {
          // if no user and there is an error
          // then pass the error to the next function
          var err = new Error('Email or password are invalid');
          err.status = 401;
          return next(err);
        }  else {
          // If the authenticate method returns the user...
          // then set the user document on the request
          req.user = userDoc;
          return next();
        }
      });
   }
};

module.exports = permsCheck;
