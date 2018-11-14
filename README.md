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

  - methods basically do the call the mongoose method

    - takes at least 2 parameters:

      - documentFromModel (compiled from a model)

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

        - may need to modify to ensure various model property types

          ... and query scenarios are accounted for

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

    - note: this in the pre-save hook refers to the model, which has the data properties that will be used by user.create to create the new user
    
## Lots more to do:

  - to be built...

    - user auth

    - then compare submitted password when auth'ing creds
      submmited password gets hashed, if hash matches, then creds are auth'ed
    - checking for current user logged-in check(session-based?)
    - require logged-in and auth'ed cred's for all routes..except root '/'
