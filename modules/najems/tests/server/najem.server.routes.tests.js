'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Najem = mongoose.model('Najem'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  najem;

/**
 * Najem routes tests
 */
describe('Najem CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Najem
    user.save(function () {
      najem = {
        name: 'Najem name'
      };

      done();
    });
  });

  it('should be able to save a Najem if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Najem
        agent.post('/api/najems')
          .send(najem)
          .expect(200)
          .end(function (najemSaveErr, najemSaveRes) {
            // Handle Najem save error
            if (najemSaveErr) {
              return done(najemSaveErr);
            }

            // Get a list of Najems
            agent.get('/api/najems')
              .end(function (najemsGetErr, najemsGetRes) {
                // Handle Najems save error
                if (najemsGetErr) {
                  return done(najemsGetErr);
                }

                // Get Najems list
                var najems = najemsGetRes.body;

                // Set assertions
                (najems[0].user._id).should.equal(userId);
                (najems[0].name).should.match('Najem name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Najem if not logged in', function (done) {
    agent.post('/api/najems')
      .send(najem)
      .expect(403)
      .end(function (najemSaveErr, najemSaveRes) {
        // Call the assertion callback
        done(najemSaveErr);
      });
  });

  it('should not be able to save an Najem if no name is provided', function (done) {
    // Invalidate name field
    najem.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Najem
        agent.post('/api/najems')
          .send(najem)
          .expect(400)
          .end(function (najemSaveErr, najemSaveRes) {
            // Set message assertion
            (najemSaveRes.body.message).should.match('Please fill Najem name');

            // Handle Najem save error
            done(najemSaveErr);
          });
      });
  });

  it('should be able to update an Najem if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Najem
        agent.post('/api/najems')
          .send(najem)
          .expect(200)
          .end(function (najemSaveErr, najemSaveRes) {
            // Handle Najem save error
            if (najemSaveErr) {
              return done(najemSaveErr);
            }

            // Update Najem name
            najem.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Najem
            agent.put('/api/najems/' + najemSaveRes.body._id)
              .send(najem)
              .expect(200)
              .end(function (najemUpdateErr, najemUpdateRes) {
                // Handle Najem update error
                if (najemUpdateErr) {
                  return done(najemUpdateErr);
                }

                // Set assertions
                (najemUpdateRes.body._id).should.equal(najemSaveRes.body._id);
                (najemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Najems if not signed in', function (done) {
    // Create new Najem model instance
    var najemObj = new Najem(najem);

    // Save the najem
    najemObj.save(function () {
      // Request Najems
      request(app).get('/api/najems')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Najem if not signed in', function (done) {
    // Create new Najem model instance
    var najemObj = new Najem(najem);

    // Save the Najem
    najemObj.save(function () {
      request(app).get('/api/najems/' + najemObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', najem.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Najem with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/najems/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Najem is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Najem which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Najem
    request(app).get('/api/najems/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Najem with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Najem if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Najem
        agent.post('/api/najems')
          .send(najem)
          .expect(200)
          .end(function (najemSaveErr, najemSaveRes) {
            // Handle Najem save error
            if (najemSaveErr) {
              return done(najemSaveErr);
            }

            // Delete an existing Najem
            agent.delete('/api/najems/' + najemSaveRes.body._id)
              .send(najem)
              .expect(200)
              .end(function (najemDeleteErr, najemDeleteRes) {
                // Handle najem error error
                if (najemDeleteErr) {
                  return done(najemDeleteErr);
                }

                // Set assertions
                (najemDeleteRes.body._id).should.equal(najemSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Najem if not signed in', function (done) {
    // Set Najem user
    najem.user = user;

    // Create new Najem model instance
    var najemObj = new Najem(najem);

    // Save the Najem
    najemObj.save(function () {
      // Try deleting Najem
      request(app).delete('/api/najems/' + najemObj._id)
        .expect(403)
        .end(function (najemDeleteErr, najemDeleteRes) {
          // Set message assertion
          (najemDeleteRes.body.message).should.match('User is not authorized');

          // Handle Najem error error
          done(najemDeleteErr);
        });

    });
  });

  it('should be able to get a single Najem that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Najem
          agent.post('/api/najems')
            .send(najem)
            .expect(200)
            .end(function (najemSaveErr, najemSaveRes) {
              // Handle Najem save error
              if (najemSaveErr) {
                return done(najemSaveErr);
              }

              // Set assertions on new Najem
              (najemSaveRes.body.name).should.equal(najem.name);
              should.exist(najemSaveRes.body.user);
              should.equal(najemSaveRes.body.user._id, orphanId);

              // force the Najem to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Najem
                    agent.get('/api/najems/' + najemSaveRes.body._id)
                      .expect(200)
                      .end(function (najemInfoErr, najemInfoRes) {
                        // Handle Najem error
                        if (najemInfoErr) {
                          return done(najemInfoErr);
                        }

                        // Set assertions
                        (najemInfoRes.body._id).should.equal(najemSaveRes.body._id);
                        (najemInfoRes.body.name).should.equal(najem.name);
                        should.equal(najemInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Najem.remove().exec(done);
    });
  });
});
