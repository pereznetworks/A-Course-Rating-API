## TD-Project11: Build a Course Rating API With Express

## Before Starting to code:

Step 1:

I studied [the project files](./build-rest-api-with-express-v3) and copied these to the root of my project folder. So I have a copy to modify and the original.

```
projectFolder/  
  '->   /src
        CourseAPI.postman_collection.json
        seed-data
        modemon.json
        package.json
        /build-rest-api-with-express-v3
        '->   /src
              CourseAPI.postman_collection.json
              seed-data
              modemon.json
              package.json

```

Steps 2 and 3:

Verified that I had the latest [MongoDB installed.](http://treehouse.github.io/installation-guides/)

With mongod running, seeded my MongoDB database with data.

```
terminal$ mongoimport --db course-api --collection courses --type=json --jsonArray --file courses.json

terminal$ terminal$ mongoimport --db course-api --collection users --type=json --jsonArray --file users.json

terminal$ mongoimport --db course-api --collection reviews --type=json --jsonArray --file reviews.json

```

Step 4:

- I checked my development environment

- Chrome Dev Tools and the npm package.json and npm environment

- I added --inspect to the npm start nodemon command,

  - so I can also use Chrome's node.js dev-tools.

- If you add the --inspect flag after running npm install...

  - you get a real neat console message...

```
module.js:545
throw err;
^
Error: Cannot find module '../lib/cli'
```

  - I needed to rm -rf node_modules and do npm install again

- After running npm install,

  - in a second terminal tab(same folder), restarted mongod

  - then in the first terminal, ran npm start

  - then I browsed to http://localhost:5000 in Chrome browser

  - able to check out the src/index.js in the Node.js Dev-Tools

Steps 5 and 6:

- Setup Postman

  - After installing (Postman)[https://www.getpostman.com/.]

  - import CourseAPI.postman_collection.jso

  - which is the collection of connection request urls

- at the beginning could only test the / *(root)* url req,

  - but it worked... so I was good to go..].

## Setting Up Database Connection:

- Modular Mongoose db connection method:

  ./startMongo.js methods, startdb(), onErr(), onceConnected()

- NPM package.json changes:

  added prestart, and downMongod script cmds to npm package.json

- so mongod process starts as part of npm start

  Added { useNewUrlParser: true } to mongoose.connection

  (node:93931) DeprecationWarning:

  current URL string parser is deprecated, and will be removed in a future version.

  To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.

- important mongod connection note: dont forget your dbName...

```
var port = 27017;
var dbName;

mongoose.connection(`mongodb://localhost:${port}/${dbName}`);

// a connection to the localhost will be made
// but if your trying to connect to a specific db, you wont be

```

## Setup Schemas and compiled Models:

- Setup schema for Users, Courses and Reviews

  - Will try to add as much validation to schema layer as possible

- In the Courses model schema ...

  - Populate User.id and Reviews is set when adding data to model

  - fieldName: {
                type: Schema.Types.ObjectId,
                ref: 'modelToGetFieldNameValuefrom'
              }

  - then need to use populate(fieldname).exec(function()) to fill in    the values...

  - when? I think, when a req comes in to run query on a course??

## Setup and test routes

- when a route actually tried to access a mongoose db :

  - (node:28756) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.

  - to git rid of the warning...
    at the beginning of each js defining a schema

  or,

  - in the beginning of routes.js accessing the docs generated from that schema

    mongoose.set('useCreateIndex', true)

## DB connection, data validation detour:

- insertData.js is not working at present, will have to fix later

  - resigned myself to going back to mongoimport ....

  - and figuring out why I could not access course-api db

- I took a second look at my mongoClient.js connect method....

  - it was because I was somehow missing the dbName is my mongoClient.js

  - for now am accessing course-api data and moving on...

  - mongoClient.js fixed
    insertData.js not fixed yet - but not using it for now

## module exports Schema detour:

- after a few days dealing with a family emergency....

  - finally got back to building some more of my course-api…

- note to self:

  - when defining schema in a separate js files:

  - make sure to use the correct syntax for the module.exports and then import using the same syntax

  - other wise your code may not throw an error but your schema won’t get properly imported

  - the only indication of a problem was when I tried to add a new user or a new course and only the id for the course/user was created and the other fields were ignored ???

  - no errors thrown….no validation errors either ???

  - just blank course/user with only an id, v fields ????

  - using Chrome dev-tools, I set up breakpoints where the new user and new course were passed to the callback functions

  - after testing both...

  - I saw in chrome dev-tools both the new user and new course object, of course were blank other than the id and v fields

  - but there was an odd property, wait for it...

  - schema: undefined????  

  - I traced back into my code

  - and saw the my module.exports syntax was different from how I was importing into my users routes js file !!!!

  - once fixed, wala!

  - perfectly formatted new user and new course, complete with all the fields required

  - that’s once mistake I won’t make again

## modularize mongoose db document methods:

  - after importing mongoose ...

  - methods basically do what the the mongoose method does

    - Only wrapped in new Promise

    - takes at least 2 parameters:

      - documentFromModel (document compiled from a model)

      - searchQueryObject, a.k.a ... {propertyName: 'string or value', }

    - then, setting a new promise to be able use Promise#then syntax

      - findQuery(documentToDoQuery, searchQueryObject).then().catch()

      - createNew(documentToDoCreate, objectDataValues).then().catch()

      - updateDoc(documentToDoUpdate, docId, updateDataObject).then().catch()

  - this will simplify the code in users and courses routes  

    - will be creating a separate .js module...in the documentMethods folder

    - then exporting from documentMethods/index.js

      - for each mongoose db method needed

      - then can re-use with no-modifiction on different models

        - can then add features to fit various queries, model property types, etc...

          ... and other scenarios not yet accounted for

## documentMethods working with:

  - using findQuery, createNew, updateDoc document methods for..

    - get /api/users and post /api/users documents

      - even getting a email unique validation error, when using dup email

    - get /api/courses, get /api/courses/:id

    - post /api/courses (creating new) and put /api/courses (updating existing)

    - post /api/courses/:id/reviews for creating a new course review

## Validation:

  - schema validation working

    - errors sent to global error handler and json formatted error sent to user

## Store encrypted passwords:

  - added pre-save hook method on user model that hashes user.password
    the calls next() so user.create will store it

    - note: 'this' in the pre-save hook refers to the model, which has the data properties that will be used by user.create to create the new user

    - reference for info in bcyrpt: https://github.com/ncb000gt/node.bcrypt.js/

## Static authenticate method and middleware ready:

  - added static authenticate method on the user schema
  - utils/permsCheck middleware calls user.authenticate

    - uses user.find then async bcrypt to compare

      - not using my modular document methods here, since this is at the schema level

      - if no email matches or password does not match then returns callback(err)

      - if authenticated, returns callback(null, user)

## Requiring auth on get /api/user and course put and post routes:

  - post /api/user

    - now able to create a new user
    - validate name, email and hash password then store in user db

  - get /api/user

    - once logged in
    - able to check creds on http req auth header
    - then return json of details of auth'ed user

  - post and put /api/courses routes

    - need modification now that auth is ready and working

      - for new Course, new Review: parse req.body and req.user into 1 object
      - for update Course : new util to take from req.body only needed data to to update

## New pre update prep Util

  - this was inspired by course update failing after adding the auth and permsCheck
  - update was failing since course.id was now present and can not be updated...

  solution : utils/preUpdatePrep

   - this is NOT for validation
      - this is simply to take out of the request body only the info needed

   - req.body is parsed by preUpdatePrep,
      - updateCourseData is passed to updateDoc documentMethod
      - this uses ...
        findOneandUpdate({title:updateCourseData.title}, {$set:updateCourseData})
      - before actual update, validation occurs, if no errors...
      - course is updated

   - in current version of course-api,
      - for updating a document compiled from course or user schema models
      - reviews dont get updated

   - for future version...
      - parsing for userSchema is ready
      - user docs may have email address updated and/or password reset

   - may make this a pre-update hook of some-kind

## Routes with Auth, Perms and Validation:

  - all routes tested again

    - everything is working!!

## documentMethods module detour:

  - in my documentMethods module...
    - found that there is some scope issue
      - property refs to other models don't work, so popluate methods not working
      - also .select does not works, aka: find({field:value}, selectOption, callback())
  - when using mongoose directly, not in my promise wrapped documentMethods...
    - then everything works !!
  - refactored all Course routes to use mongoose db methods directly
    - will have to figure out why later..
    - removed calls to my documentMethods
    - using only in 1 route and User routes
        - post new review route uses my documentMethods
  - retested all routes
    - auth, permission check, validation...
    - and actual CRU db ops working
  - now back to Exceed number 3 and specifying deep pop of specific fields only

## Exceed #1: for Review Model...

  - additional validation to prevent user who owns course from reviewing that course

    - note : `doc._id.equals(otherDoc._id))` works
      - the above example using equals to compare both `_id`
      - need to be sure comparing values, of the same type
      - however, 2 reasons I found many get inconsistent results
        - 1: some mistakenly comparing the entire ObjectID
          - this will always be false,  `Doc.ObjectId.equals(otherInstanceOfsameDoc.ObjectId)`
        - 2: using == or === compares the instance of the doc not the value
          - `Doc._id.equals == otherInstanceOfsameDoc._Id` will always be false
      - can test the property's value type using toString()
        - `someDoc.ObjectID.toString()`, will stringify an object, not desired in this case
        - `someDoc._id.toString()`, will stringify into desired formated string.. 's1o3mel0on3g9n8m5b2e7r'

## Exceed #2: for User Routes...

  - will be writing tests for the following scenarios:
    - a request to the GET /api/user route with the correct credentials
      - the corresponding user document is returned
    - a request to the GET /api/user route with the invalid credentials
      - a 401 status error is returned

  - tools used:
    - test framework
      - Mocha/Chai
      - supertest
      - use Postman to generate the auth headers
    - npm
      - Setup pretest, test, and posttest in package.json
      - the npm test cmd will run among others...
        - tests on User routes as described above
        ```
        "scripts": {
          "pretest": "mongod --config etc/mongod.conf",
          "test": "node_modules/.bin/mocha --exit --no-warnings",
          "posttest": "mongo admin --eval 'db.shutdownServer()'",
                }
        ```
    - at the console, when running `npm test` I got the error...
    ``` > mocha

          module.js:545
          throw err;
          ^

          Error: Cannot find module './options'
            at Function.Module._resolveFilename (module.js:543:15)
            ...
    ```
      - I found... https://github.com/mochajs/mocha/issues/2423
        - and just did the following...
          - `rm -rf node_modules` dir and `run npm install`
          - then `npm test` worked fine

  - basic cli functionality:
    - run cmd, `npm test`
      - Mocha will run all js files in /test folder
      - result will be std out'ed to console

  - eventually...
    - should be able to test all routes and scenarios using this method

## Exceed #3: for Course Routes..

  - get /api/course/:id popluate course with reviews

  - on GET /api/course/:id
    - populate the course review array of review id's
      - replacing the id's with...
        - the rating and review, plus reviewer's, user, fullname
    - using Mongoose deep population to
        - return only the fullName of the related user on the course model
        - and each rating and the review text
        - all returned with the course model.
        - by default hides other user’s private details,
          - like passwords and emails, from other users.

## my custom insertData module is fixed:

  - fixed the json syntax
  - for users, using a create in a forEach loop
    - passwords get hashed
    - uses sample data from original project files

  *IDEA:*
  - use process.env set to development or production
    - when express server started in development, insertData methods are executed
    - when express server stopped in development, all data deleted
  - also set up a db reset
    - do a reset, so can start and stop with persistence, and reset only when needed

## prep for project submission:

  - DONE: finish exceeds

  - final code walk-through
    - re-verify meeting project expectations and exceeds

  - compile simple readme.md for reviewer
    - will not be submitting mongo db data dir with project
    - so will have to provide a method or instructions...
      - for reviewer to setup everything and test the project

  - this readme will become 'dev notes'
