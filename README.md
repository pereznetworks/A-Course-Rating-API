## TD-Project11: Build a Course Rating API With Express:

# For the Reviewer, or any daring developer:

- to get started with this project, do these setup tasks:

  - 1:) download a copy of this repo

  - 2:) from a terminal prompt cd the root of the repo folder

  - 3:) create folders
      - from the root of the repo folder
        - run the following cmd to setup the project
          - mkdir data
          - mkdir data/db
          - mkdir logs
          - npm install

- with setup task are complete, your ready to...

  - 1:) npm start
      - runs the course-api rest express server
        - runs and connects mongod
        - insertData checks courses, reviews and users collections for data
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

# More detail on what *npm start* does:

- "nodemon --ignore data/ --ignore logs/ --inspect ./index.js localhost 5000"

  - npm start, will do the following:

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

      - waits and listen for http req on localhost:5000
