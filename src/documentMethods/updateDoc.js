/* update document using 3 paramters
  ...document from compiled model to use to run update cmd
  ... id of document to update
  ... updateDataObject, containing ...
      { key: value pairs of sub-document/s to find and update}
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");

var updateDoc = function(documentToDoUpdate, docId, updateDataObject, arrayName){

  if (arrayName){
    // if arrayName, find doc and push new values onto that doc.arrayName then save doc
    return new Promise((resolve, reject) => {
      // find the doc by id
      documentToDoUpdate.find(docId, function (err, doc) {
          if (err) {
            reject(err);
          } else if (doc[0] && updateDataObject ){
          // point of failure...
            // the .push does not take a call back and does not return anything..
            // if doc[0] or updateDataObject is not present or not expected format
            // or if an error occurs push onto reviews array
                // ... then unhandled error
            doc[0].reviews.push(updateDataObject);
            doc[0].save(function (err) {
              if (err) {
                reject(err);
              } else {
                const result = { status: 201, doc: doc};
                resolve(result);
              }
            });
          }
      });
    });
  } else {
    // if property of doc is not an array just finOneAndUpdate
    return new Promise((resolve, reject) => {
      // create an object with form input
      documentToDoUpdate.findOneAndUpdate({title: updateDataObject.title}, {$set: updateDataObject}, function (err, doc) {
          if (err) {
            reject(err);
          } else {
            const result = { status: 201, doc: doc};
            resolve(result);
          }
      });
    });
  }
};
module.exports = updateDoc;
