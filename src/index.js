'use strict';

// load npm modules
const express = require('express');
const morgan = require('morgan');
const app = express();

// bringing in mongod data models
const User = require('./models.js').User;
const Course = require('./models.js').Course;
const Review = require('./models.js').Review;

// set our port
app.set('port', process.env.PORT || 5000);

// my own modular mongoose connection method and callbacks
const mongoClient = require('./mongoClient.js')

// connecting to mongodb...
const db = mongoClient.connect();

// if error in connection...
db.on("error", function(err){
	mongoClient.onErr(err);
});

// if connected and all is good...
db.once("open", function(){
	mongoClient.onceConnected();
});

// morgan gives us http request logging
app.use(morgan('dev'));

// TODO add additional routes here

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
