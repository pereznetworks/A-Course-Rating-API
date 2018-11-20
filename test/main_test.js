var request = require('supertest');
var expect = require('chai').expect;

//sample test - use when setting up new npm/mocha
describe('\nmake sure my Mocha is ready, 8 shots please ', function () {
  // test spec, aka... unit test
  it('running Mocha test using npm, expect(true) to be ok ', function () {
    expect(true).to.be.ok;  // 'it' is a Mocha function; 'ok' is an assertion method in chai
  });
});

/* testing course-api rest server routes
   pretest script in npm package.json...
      pretest script does...
        mongod --config etc/mongod.conf
   const app = require('../index.js') --- launches express server itself
      after the tests, successful or not...
        mongo admin --eval 'db.shutdownServer()
*/

const app = require('../index.js');

/* Home Route or root path */

describe('\nGET http://localhost:5000', function() {
  it('when browsing to home path, ', function(done) {
    request(app)
      .get('/')
      .expect(200, {
                    "message": "Welcome to the Course Review API"
                   }, done);
  });
});

/* User Routes */

describe('\nGET http://localhost:5000/api/users', function() {
  it('getting url /api/users, when No auth, res is status 401', function(done) {
    request(app)
      .get('/api/users')
      .set({'Accept': 'application/json',
            'cache-control': 'no-cache'
           })
      .expect('Content-Type', /json/)
      .expect(401, done);
  });
});

describe('\nGET http://localhost:5000/api/users', function() {
  it('getting url /api/users, when auth, res is status 200, json format of corresponding user doc', function(done) {
    request(app)
      .get('/api/users')
      .set({'Accept': 'application/json',
            'cache-control': 'no-cache',
            'Authorization': 'Basic am9lQHNtaXRoLmNvbTohcGFzc3dvcmRA'
           })
      .expect('Content-Type', /json/)
      .expect(200, [{
        "_id": "5bed2763880ec93d1596578d",
        "fullName": "Joe Smith",
        "emailAddress": "joe@smith.com",
        "password": "$2b$10$7eyFUx9n9Npu0hTobhM2O.K/XZwz7WKJTmlFU0ldJuBUAvFPg.6zW",
        "__v": 0
        }], done);
  });
});
