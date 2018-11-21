#!/bin/bash

# tbis was written and works on macOS X using a bash shell
# the express course-api server /src code does not use this
# it's here only for developers who know what this is for...
  
echo -e 'import data using mongo-import...'
echo -e 'importing courses...\n'
mongoimport --db course-api --collection courses --type=json --jsonArray --file courses.json
echo -e 'importing users...\n'
mongoimport --db course-api --collection users --type=json --jsonArray --file users.json
echo -e 'importing reviews...\n'
mongoimport --db course-api --collection reviews --type=json --jsonArray --file reviews.json
echo -e "okay... we're all done here..\n"
