// importing methods here, so I can import them elsewhere more simply

var runFindQuery = require('./runFindQuery.js');
var createNew = require('./createNew.js');
var updateDoc = require('./updateDoc.js');

module.exports.runFindQuery = runFindQuery;
module.exports.createNew = createNew;
module.exports.updateDoc = updateDoc;
