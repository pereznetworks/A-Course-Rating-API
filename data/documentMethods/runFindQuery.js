/* run find query using 2 paramters
  ...document from compiled model
  ...queryObject, containing key/value pairs of sub-document/s to find
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");


const runFindQuery = function(documentToDoQuery, queryObject){

  return new Promise((resolve, reject) => {
    documentToDoQuery.find(queryObject, function(err, doc){
      if(err){
        reject(err);
      } else if(!doc){
        const err = new Error(`Oops, no ${documentToDoQuery} found`);
        err.status = 404;
        reject(err);
      } else {
        const result = {doc: doc, status: 200};
        resolve(result);
      }
    });
  })
};

module.exports = runFindQuery;
