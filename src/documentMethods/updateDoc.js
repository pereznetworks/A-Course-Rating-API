/* update document using 2 paramters
  ...document from compiled model to use to run update cmd
  ...dataValuesString, containing ...
     `id, $set: { key: value pairs of sub-document/s to find and update}`
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");

var updateDoc = function(documentToDoUpdate, docId, updateDataObject){

  return new Promise((resolve, reject) => {
    // create an object with form input
    documentToDoUpdate.findByIdAndUpdate(docId, {$set: updateDataObject}, function (err, doc) {
        if (err) {
          reject(err);
        } else {
          const result = { status: 201, doc: doc};
          resolve(result);
        }
    });
  });

};

module.exports = updateDoc;
