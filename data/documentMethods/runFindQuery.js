/* run find query using 2 paramters
  ...document from compiled model
  ...queryObject, containing key/value pairs of sub-document/s to find
*/

// import mongoose, so use it's db document/model methods
var mongoose = require("mongoose");


const runFindQuery = function(documentToDoQuery, queryObject){

  return new Promise(resolve => {
    documentToDoQuery.find(queryObject, function(err, user){
      if(err){
        resolve(err);
      } else if(!user){
        const err = new Error("Oops, no user found");
        err.status = 404;
        resolve(err);
      } else {
        const result = {user: user, status: 200};
        resolve(result);
      }
    });
  })
};

module.exports = runFindQuery;
