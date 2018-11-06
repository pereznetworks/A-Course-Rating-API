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

    added prestart, and downMongod script cmds to npm package.json

so mongod process starts as part of npm start

    Added { useNewUrlParser: true } to mongoose.connection

    (node:93931) DeprecationWarning:

    current URL string parser is deprecated, and will be removed in a future version.

    To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.

important mongod connection note: dont forget your dbName...

    ```
    var port = 27017;
    var dbName;

    mongoose.connection(`mongodb://localhost:${port}/${dbName}`);

    // a connection to the localhost will be made
    // but if your trying to connect to a specific db, you wont be

    ```


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

## Lots more to do :

  ...
