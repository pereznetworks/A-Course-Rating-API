/* run find query using 2 paramters
  ...document from compiled model to use to run find query
  ...queryObject, containing key/value pairs of sub-document/s to find
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");

const runFindQuery = function(documentToDoQuery, queryObject, selectItem){

  if (selectItem){
    return new Promise((resolve, reject) => {
      // the select.query method seems to workin only on instances on a document
      documentToDoQuery.find(queryObject, selectItem, function(err, doc){
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
      })
    })
  } else {
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
  }
};

module.exports = runFindQuery;
