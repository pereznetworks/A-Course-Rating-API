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

see [Mongod Getting Start Note](#mongodb-getting-started-note) below
```
terminal$ mongoimport --db course-api --collection courses --type=json --jsonArray --file courses.json

terminal$ terminal$ mongoimport --db course-api --collection users --type=json --jsonArray --file users.json

terminal$ mongoimport --db course-api --collection reviews --type=json --jsonArray --file reviews.json

```

Step 4:

I checked my development environment

Chrome Dev Tools and the npm package.json and npm environment

I added --inspect to the npm start nodemon command,

so I can also use Chrome's node.js dev-tools.

If you add the --inspect flag after running npm install...

you get a real neat console message...

```
module.js:545
throw err;
^
Error: Cannot find module '../lib/cli'
```

I neede to rm -rf node_modules and do npm install again

After running npm install,

in a second terminal tab(same folder), restarted mongod

then in the first terminal, ran npm start

then I browsed to http://localhost:5000 in Chrome browser

and checked out the started src/index.js in the Node.js Dev-Tools

Steps 5 and 6:

Setup Postman

After installing (Postman)[https://www.getpostman.com/.]

then ran it ..import CourseAPI.postman_collection.jso

the collection of connection request urls

at the beginning could only test the / *(root)* url req,

but it worked... so I was good to go..].

## Setting Up Database Connection:

Modular Mongoose db connection method:

./startMongo.js methods, startdb(), onErr(), onceConnected()

NPM package.json changes:

aded prestart, and downMongod script cmds to npm package.json

so mongod process starts as part of npm start

Added { useNewUrlParser: true } to mongoose.connection

(node:93931) DeprecationWarning:

current URL string parser is deprecated, and will be removed in a future version.

To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.

## Setup Schemas and compiled Models:

Setup schema for Users, Courses and Reviews

Will try to add as much validation to schema layer as possible

In the Courses model schema ...

Populate User.id and Reviews is set when adding data to model

 fieldName {
              type: Schema.Types.ObjectId,
              ref: 'modelToGetFieldNameValuefrom'
            }

 then need to use populate(fieldname).exec(function()) to fill in the values

## Setup and test routes

  when a route actually tried to access a mongoose db :

    (node:28756) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.

    to git rid of the warning...
      at the beginning of each js defining a schema
    or,
      in the beginning of routes.js accessing the docs generated from that schema

      mongoose.set('useCreateIndex', true)

## Mongodb getting started note:

although the steps in the project requirement indicate to:

    1: running mongod in 1 term (project root dir)

       and in 2nd term (same project root dir)

       mongoimport seed data using - mydbname

    2: then, create a mongo connection using - mydbname

    3: and, create models from schema and and doc/collection to match

    4: then work on routes,

       that will run queries on these and return json data

That did not work for me:

    I ended up having to start over, used these basic Mongo shell cmds

    mongod in 1 term
    mongo shell in 2nd term
      show dbs
      use mydbname
      db.dropDatabase()

process as documented on https://mongoosejs.com/docs/models.html :

  *this second set of steps...*

   *was the only I could get data into the document/collections*

   *I created from the models I declared*

   *and then return data using routes I setup*

    1: create a mongoose connection using - mydbname

    2: create schema and declare models

    3: create documents from the models

    4: seed data using ....

      the insertMany method on the document/collection from step 3

          I wrote a module for this in seed-data/insertData.js

          which exports initUsers, initCourses, initReviews methods

          these are run by index.js when the express server starts

          basically...

            on each of the user, course, review documents/collections

            if no results returned from a find({})

            then an insertMany is performed

    5: then with routes set

      can run queries on these documents/collections

      which Returns json data as expected

*it seems that even though, per the project instructions...*

  *I run the mongo-import cmds,*

  *and am connecting to the course-api db,*

  *I am actually not able to access that data,*

  *other than through mongo shell directly*

  *maybe it's necessary to break from mongoose.js*

  *and use some mongod methods...*

  *and syntax to get this working from mongoimport*

  *but for now, I am using pure mongoose.js*

## Lots more to do :

  ...
