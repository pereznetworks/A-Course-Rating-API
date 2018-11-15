// importing methods here, so I can import them elsewhere more simply

// connect to Mongo db server, notify on error or onceConnected
var connect = require('./mongoClient.js').connect;
var onErr = require('./mongoClient.js').onErr;
var onceConnected = require('./mongoClient.js').onceConnected;

// check HTTP Req Authorization header for valid credentials
var permsCheck = require('./permsCheck.js');

module.exports.connect= connect;
module.exports.onErr = onErr;
module.exports.onceConnected = onceConnected;
module.exports.permsCheck = permsCheck;
