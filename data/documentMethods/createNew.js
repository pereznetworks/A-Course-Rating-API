/* create user using 2 paramters
  ...document from compiled model
  ...queryObject, containing key/value pairs of sub-document/s to create
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");

var createNew = function(documentToDoCreate, objectDataValues){

  return new Promise((resolve, reject) => {
    // create an object with form input
    var document = new documentToDoCreate(objectDataValues);

    // make sure newUser get saves to the db
      document.save(function (err, doc) {
        if (err) {
          reject(err);
        } else {
          const result = {doc: doc, status: 201};
          resolve(result);
        }
    });
  });

};

module.exports = createNew;
