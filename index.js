'use strict';

// load npm modules
const express = require('express');
const morgan = require('morgan');
const app = express();

// set the port
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

/* import insertData methods

	TODO: fix the syntax problems in the seed-data object
	.. this does not work,
	.. there are syntax problems in the seed-data object
	.. for now using mongoimport to import seed-data

	const initCourses = require('./seed-data/insertData.js').initCourses;
	const initReviews = require('./seed-data/insertData.js').initReviews;
	const initUsers = require('./seed-data/insertData.js').initUsers;

	// test if seedData has been inserted into db.course-api
	// if not insert data, logs to console on err or success

	initCourses();
	initReviews();
	initUsers();

*/

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});

// importing user and course routes
const userRoutes = require('./routes/users.js');
const courseRoutes = require('./routes/courses.js');

app.use(courseRoutes);
app.use(userRoutes);

app.use('/api/courses', courseRoutes);
app.use('/api/courses/:id', courseRoutes);
app.use('/api/users', userRoutes);
// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404)
	res.json({
    message: 'Route Not Found',
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500)
	res.json({
    message: err.message,
    error: err.status,
		details: err.stack
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports = db;
