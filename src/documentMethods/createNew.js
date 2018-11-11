/* create user using 2 paramters
  ...document from compiled model top use to run create cmd
  ...objectDataValues, containing key/value pairs of sub-document/s to create
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");

var createNew = function(documentToDoCreate, objectDataValues){

  return new Promise((resolve, reject) => {
    // create an object with form input
    documentToDoCreate.create(objectDataValues, function (err, doc) {
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
