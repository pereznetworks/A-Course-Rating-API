# Building a Course Rating API With Express:

- this was originally part of Project 11,
- Full Stack JavaScript, Unit 11
- from TeamTreehouse, Tech Degree,

## Features
- API Requires user login
- API Stores and validates encrypted password
- API USER Route : User Auth
- API Course Route: Access Courses table
- API Reviews Route : Access Reivews Table
- Document Methods using Promise
- Deep Pop of Tables data
- Data Validation
- Testing API Routes
- MongdoDb cli and custom scripting
...and more

## To Build Your Own:

- 1:) download a copy of this repo

- 2:) from a terminal prompt, cd the root of the repo folder

- 3:) create folders
    - get to the root of the repo folder
    - do the following
        - make a directory and subdirectory, name it: data/db
        - make a directory, name it: logs
        - then run: npm install

- 4:) [get Mongodb Community Edition](https://www.mongodb.com/try/download/community)
  - install lastest verson of mongodb community server
  - and learn the latest mongodb syntax of cli and db methods
  - adjust this code to use any new syntax of cli and methods accordingly

- 5:) [my dev notes](./devnotes.md)
  - for those interested in actually building their own from scratch

## With setup task are complete, your ready to...

### 1:) npm start
  - runs the course-api rest express server
    - runs and connects to mongod, course-api db
    - my custom insertData module then ...
      - checks courses, reviews and users collections for data
      - if none exist, it inserts the data
      - with the exception of passwords...
        - the users created are the same as form the sample project files
        - for the user passwords see: src/seed-data/more-users.json
          - the first 3 users are inserted by the insertData module

 - to stop the server...
    - at the terminal, ctrl-c to stop server
    - then run the following cmd...
      - npm stop
        - this will down the mongod daemon
        - then can you run, npm start again or npm test

### 2:) use Postman
  - import test/CourseAPI.postman_collection.json
  - with the course-api rest express server running
    - test responses GET/POST/PUT requests

### 3:) after running npm start, at least once, you can run npm test

- you must run *npm start* at least once
  - before trying to run *npm test*
  - otherwise there will be no data to test against

- for now, testing only user routes
  - GET /api/users - with auth'ed user credentials
    - status code of 200 and user doc
  - GET /api/users - without auth'ed user credentials
    - status code 401 and a 'Your not logged in' Mongo error

- when complete, the posttest script downs the mongod daemon
   - however, if any of the test fails, you must run it manually..
     - ctrl-c to exit and then npm stop

### 4:) can use Chrome browser to
  -  chrome:/inspect
    - verify Chrome's DevTools for Nodejs has connected
  - http://localhost:5000
    - open Developer Tools and open dedicated DevTools for Node.js

### 5:) Reseting after messing up data in the db
- if after messing around with user, review or course data...
  - and for what ever reason.... you need to start over
  - ONLY DO THIS IN DEVELOPMENT WHEN USING SAMPLE DATA
  - DON'T DO THIS WITH ANY PRODUCTION DATABASES


- 1: ctrl-c to stop the course-api rest express server


- 2: npm stop
 - to make sure mongod is down


- 3: npm run runMongod
  - starts Mongod and exits back to a prompt


- 4: npm run cleanDb
  - will remove all users, courses and reviews...


- 5: npm stop
  - to make sure mongod is down again


- 6: run npm start again
  - and then a fresh copy of sample data will be inserted

## More detail on what *npm start* does:

### npm start, will do the following (when using nodemon):

`nodemon --ignore data/ --ignore logs/ --inspect ./index.js localhost 5000`

- 1: tells nodemon to ignore files in the logs and data folders
  - otherwise, nodemon restarts everything when any other files change

- 2: runs mongod using etc/mongod.conf settings

- 3: starts the express server with the -inspect flag
  - so can use Chrome DevTools
  - connects to course-api db, using mongoose.connect
  - checks if there is data in courses, reviews and users collections
  - if no data exists..
    - insertData has hard-coded data
      - taken from sample data from project files provided
      - inserts course and review data
      - create users, hashing passwords

- 4: waits and listens for http req on localhost:5000

## Detail on Nodemon vulnerability

- as of 11/26/2019
  - I recommend only using Nodemon with modification
    - remove anything that uses flatmap-stream
    - nodemon uses pstree, ->  event-stream@3.3.6 -> flatmap-stream
    - for specifics on the notice
      - see [below under Development Notes](#developer-notes)

- by the time you are reading this...
  - the errant flatmap-stream module may have been removed from event-stream
  - when a fix is released I will place [Nodemon](https://www.npmjs.com/package/nodemon) back in as dev dependency

- for now changed npm start
  - instead of:
    - "nodemon --ignore data/ --ignore logs/ --inspect ./index.js localhost 5000"
  - changed to:
    - "node --inspect ./index.js localhost 5000"

#### recommend not to use nodemon unless this has been fixed

#### dependency tree on nodemon as of 11/26/2019

- following the dependencies up to top most module
  - nodemon requires pstree.remy  
  - pstree.remy requires pstree
  - pstree requires event-stream
  - event-stream requires the malicious module, flatmap-stream


- story is flatmap-stream is considered malicious.
  - A malicious actor added this package as a dependency to the NPM event-stream package in versions 3.3.6 and later.
  - Users of event-stream are encouraged to downgrade to the last non-malicious version, 3.3.4.
  - Users of flatmap-stream are encouraged to remove the dependency entirely.
