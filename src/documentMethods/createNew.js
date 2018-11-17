/* create user using 2 paramters
  ...document from compiled model to use to run create cmd
  ...objectDataValues, containing key/value pairs of sub-document/s to create
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");

var createNew = function(documentToDoCreate, objectDataValues){
    let newReviewData;

    if (documentToDoCreate.modelName === 'review'){
      // get data values
       newReviewData = {
          user: objectDataValues.user,
          rating: objectDataValues.body.rating,
      };

      if (objectDataValues.body.review == null){
         newReviewData.review = '';
      } else {
         newReviewData.review = objectDataValues.body.review;
      }

      return new Promise((resolve, reject) => {
        // create an object with form input
        documentToDoCreate.create(newReviewData, function (err, doc) {
            if (err) {
              reject(err);
            } else {
              const result = {doc: doc, status: 201};
              resolve(result);
            }
        });
      });

    } else {

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

    }

};

module.exports = createNew;
