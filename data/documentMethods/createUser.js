/* create user using 2 paramters
  ...document from compiled model
  ...queryObject, containing key/value pairs of sub-document/s to create
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");

var createUser = function(documentToDoCreate, objectDataValues){


  return new Promise(resolve => {
    // create an object with form input
    var document = new documentToDoCreate(objectDataValues);

    // make sure newUser get saves to the db
      document.save(function (err, user) {
        if (err) {
          resolve(err);
        } else {
          const result = {user: user, status: 201};
          resolve(result);
        }
    });
  });

};

module.exports = createUser;
