## TD-Project11: Build a Course Rating API With Express:

# for beginners who do not know how to work-around module dependencies....
  - as of 11/26
    - I recommend only using Nodemon with modification
      - remove anything that uses flatmap-stream
      - nodemon uses pstree, ->  event-stream@3.3.6 -> flatmap-stream
      - for specifics on the notice
        - see [below under Development Notes](#developer-notes)
  - by the time you are reading this...
    - the errant flatmap-stream module may have been removed from event-stream
    - otherwise, when a fix is released will place [Nodemon](https://www.npmjs.com/package/nodemon) back in as dev dependency
  - for now changed npm start
    - instead of:
      - "nodemon --ignore data/ --ignore logs/ --inspect ./index.js localhost 5000"
    - changed to:
      - "node --inspect ./index.js localhost 5000"

# For the Reviewer, or any daring developer:

- this project is setup for Project 11 Meet Expectations and Extra features

- to get started with this project, do these setup tasks:

  - 1:) download a copy of this repo

  - 2:) from a terminal prompt, cd the root of the repo folder

  - 3:) create folders
      - from the root of the repo folder
        - run the following cmds to setup the project
          - mkdir data
          - mkdir data/db
          - mkdir logs
          - npm install

- with setup task are complete, your ready to...

  - 1:) npm start
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

  - 2:) use Postman
      - import test/CourseAPI.postman_collection.json
      - with the course-api rest express server running
        - test responses GET/POST/PUT requests

  - 3:) after running npm start, at least once, you can run npm test

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

  - 4:) can use Chrome browser to
      -  chrome:/inspect
        - verify Chrome's DevTools for Nodejs has connected
      - http://localhost:5000
        - open Developer Tools and open dedicated DevTools for Node.js

  - 5:) if after messing around with user, review or course data...
      - and for what ever reason.... you need to start over
      - ctrl-c to stop the course-api rest express server
      - npm stop
        - to make sure mongod is down
      - npm run runMongod
        - starts Mongod and exits back to a prompt
      - npm run cleanDb
        - will remove all users, courses and reviews...
      - npm stop
        - to make sure mongod is down again
      - just run npm start again
        - and then a fresh copy of sample data will be inserted

# More detail on what *npm start* does:

- npm start, will do the following:

  - "nodemon --ignore data/ --ignore logs/ --inspect ./index.js localhost 5000"

    - tells nodemon to ignore files in the logs and data folders

    - otherwise, nodemon restarts everything when any other files change

    - runs mongod using etc/mongod.conf settings

    - starts the express server with the -inspect flag

      - so can use Chrome DevTools

      - connects to course-api db, using mongoose.connect

      - checks if there is data in courses, reviews and users collections
        - if no data exists..
          - insertData has hard-coded data
              - taken from sample data from project files provided
              - inserts course and review data
              - create users, hashing passwords

      - waits and listens for http req on localhost:5000

## Developer Notes

- error on the side of caution...
  - for now removing nodemon from the development deps
  - will put nodemon back in once nodemon or its deps fix or remove the errant module

  - given alert regarding flatmap-stream
    - following the dependencies up to top most module
      - nodemon requires pstree.remy  
      - pstree.remy requires pstree
      - pstree requires event-stream
      - event-stream requires the malicious module, flatmap-stream
    - The NPM package flatmap-stream is considered malicious.
      - A malicious actor added this package as a dependency to the NPM event-stream package in versions 3.3.6 and later.
      - Users of event-stream are encouraged to downgrade to the last non-malicious version, 3.3.4.
      - Users of flatmap-stream are encouraged to remove the dependency entirely.

- for the few and the brave...

  [my devloper notes](https://github.com/pereznetworks/TD-Project11/blob/master/devnotes.md)
