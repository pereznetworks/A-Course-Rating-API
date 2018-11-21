## TD-Project11: Build a Course Rating API With Express:

# For the Reviewer:

  - to get started, do these setup tasks:

    - 1:) download a copy of this repo

    - 2:) from a terminal prompt cd the root of the repo folder

    - 3:) create folders
        - from root, '/', run the following cmd to setup the project
          - mkdir data
          - mkdir data/db
          - mkdir logs
          - npm install

  - with setup task are complete, your ready to...

      1:) npm start
          - to run the course-api rest express server
            - runs and connects mongod
            - also runs insertData if needed  

         !) after exiting ctrl-c to close server, run the following cmd...
            - npm run downMongod
              - this will down the mongod server
              - then can run, npm start or npm test again

      2:) run npm test

          !) must run *npm start* before trying to run *npm test*)

          - tests user routes 
            - GET /api/users - with auth'ed user credentials
              - status code of 200 and user doc
            - GET /api/users - without auth'ed user credentials
              - status code 401 and a 'Your not logged in' Mongo error

          !) posttest script runs downMongod script
             - however, if any of the test fails, you must run it manually..
               npm run downMongod

      3:) use Postman
          - import test/CourseAPI.postman_collection.json
          - test responses GET/POST/PUT requests

      4:) can use Chrome browser to
          -  chrome:/inspect
            - verify Chrome's DevTools for Nodejs has connected
          - http://localhost:5000
            - open Developer Tools and open dedicated DevTools for Node.js

# What *npm start* does:

  - npm start, will do the following:
    - run mongod using etc/mongod.conf setting
    - using nodemon with -inspect flag
      - so can use Chrome DevTools
      - ignore changes /data and /log folders
    - start the express server
    - connect to course-api db, using mongoose.connect
    - check if there is data in courses, reviews and users collections
      - if no data exist..
        - using sample data from project files provided
          - insert course and review data
          - create users, hashing passwords
    - wait and listen for http req on localhost:5000
