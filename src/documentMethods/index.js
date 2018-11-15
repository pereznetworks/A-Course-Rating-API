// importing methods here, so I can import them elsewhere more simply
// main use is when an express route handler needs to do something to mongo document

var runFindQuery = require('./runFindQuery.js');
var createNew = require('./createNew.js');
var updateDoc = require('./updateDoc.js');

module.exports.runFindQuery = runFindQuery;
module.exports.createNew = createNew;
module.exports.updateDoc = updateDoc;
