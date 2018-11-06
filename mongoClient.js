/* mongoClient.js,
   a simple custom Mongoose connection manager
   I started writing with this project  */

/* usage:

   // first in your node.js/Express app or index.js....

      var startMongo = require('./startMongo');

   // give the conneciton a name ...
      // with no args...
         // defaults to port 27017 and 'course-api' as database name

          var myMongooseConnectionName = startMongo.startdb();

    // you can change the port and name of the db ...
      // pass port as an interger
        // pass the dbName as a string

          var myMongooseConnectionName = startdb(27017, 'myDatabaseName');
    */

const connect = function(port, dbName){

    // importing mongoose
    var mongoose = require("mongoose");

    // adding some configurability options
    if (!port ){
      let port = 27017;
    }

    if (!dbName){
      let dbName = 'course-api';
    }

    // connecting to mongod db
    /*  DeprecationWarning: current URL string parser is deprecated,
        and will be removed in a future version.
        To use the new parser, pass option { useNewUrlParser: true }
        to MongoClient.connect.
    */

    mongoose.connect(
      `mongodb://localhost:${port}/${dbName}`,
       {
         useNewUrlParser: true,
         useCreateIndex: true,
         autoIndex: true
       }
     );

    // return the mongoose connection
    return mongoose.connection;

};

//place with in callfuncton, db.on('error',function(err){ startMongo.onErr(err)} )
var onErr = function(err){
  // may change how error are logged
	console.error(`**Mongod status**\nconnection error:`, err);
};

// place within callback function db.once('open', function(){ startMongo.onceConnected()} )
var onceConnected = function(){
  // may change how message are logged
	console.log(`**Mongod status**\ndb connection successful`);
};


module.exports.connect = connect;
module.exports.onErr = onErr;
module.exports.onceConnected = onceConnected;
