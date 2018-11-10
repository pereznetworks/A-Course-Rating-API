'use strict';

// load npm modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const app = express();

// set the port
app.set('port', process.env.PORT || 5000);

// my own modular mongoose connection method and callbacks
const mongoClient = require('./src/utils/mongoClient.js')

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

// all routes can use body-parser to parse json formatted data sent in req.body
// so req.body must be an object with key/value properties
app.use(bodyParser.json())

/* import insertData methods

	//TODO: fix the syntax problems in the seed-data object
	.. this does not work,
	.. there are syntax problems in the seed-data object
	.. for now using mongoimport to import seed-data

	const initCourses = require('./src/seed-data/insertData.js').initCourses;
	const initReviews = require('./src/seed-data/insertData.js').initReviews;
	const initUsers = require('./src/seed-data/insertData.js').initUsers;

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

// importing user and course router modules
const userRoutes = require('./src/routes/users.js');
const courseRoutes = require('./src/routes/courses.js');

// tells express app to use these router modules
app.use(courseRoutes);
app.use(userRoutes);

// tells express app which paths to use with which routes
app.use('/api/courses', courseRoutes);
app.use('/api/courses/:id', courseRoutes);
app.use('/api/users', userRoutes);

// send 404 if no other route matched and no error once processing a route
app.use((req, res) => {
  res.status(404)
	res.json({
    message: 'Route Not Found',
  })
})

// global error handler
// for an err to get here just need to next(err) from any route
app.use((err, req, res, next) => {
  console.error(err.stack);
	if (err.name = 'MongoError'){
		res.status(400);
		res.json({
			message: err.message,
			status: 400,
			details: err.stack
		});
	} else {
  	res.status(500)
		res.json({
			message: err.message,
			status: 500,
			details: err.stack
		});
	}

});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports = db;
