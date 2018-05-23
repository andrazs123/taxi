'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Taxi = mongoose.model('Taxi'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  taxi;

/**
 * Taxi routes tests
 */
describe('Taxi CRUD tests', function () {

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

    // Save a user to the test db and create new Taxi
    user.save(function () {
      taxi = {
        name: 'Taxi name'
      };

      done();
    });
  });

  it('should be able to save a Taxi if logged in', function (done) {
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

        // Save a new Taxi
        agent.post('/api/taxis')
          .send(taxi)
          .expect(200)
          .end(function (taxiSaveErr, taxiSaveRes) {
            // Handle Taxi save error
            if (taxiSaveErr) {
              return done(taxiSaveErr);
            }

            // Get a list of Taxis
            agent.get('/api/taxis')
              .end(function (taxisGetErr, taxisGetRes) {
                // Handle Taxis save error
                if (taxisGetErr) {
                  return done(taxisGetErr);
                }

                // Get Taxis list
                var taxis = taxisGetRes.body;

                // Set assertions
                (taxis[0].user._id).should.equal(userId);
                (taxis[0].name).should.match('Taxi name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Taxi if not logged in', function (done) {
    agent.post('/api/taxis')
      .send(taxi)
      .expect(403)
      .end(function (taxiSaveErr, taxiSaveRes) {
        // Call the assertion callback
        done(taxiSaveErr);
      });
  });

  it('should not be able to save an Taxi if no name is provided', function (done) {
    // Invalidate name field
    taxi.name = '';

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

        // Save a new Taxi
        agent.post('/api/taxis')
          .send(taxi)
          .expect(400)
          .end(function (taxiSaveErr, taxiSaveRes) {
            // Set message assertion
            (taxiSaveRes.body.message).should.match('Please fill Taxi name');

            // Handle Taxi save error
            done(taxiSaveErr);
          });
      });
  });

  it('should be able to update an Taxi if signed in', function (done) {
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

        // Save a new Taxi
        agent.post('/api/taxis')
          .send(taxi)
          .expect(200)
          .end(function (taxiSaveErr, taxiSaveRes) {
            // Handle Taxi save error
            if (taxiSaveErr) {
              return done(taxiSaveErr);
            }

            // Update Taxi name
            taxi.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Taxi
            agent.put('/api/taxis/' + taxiSaveRes.body._id)
              .send(taxi)
              .expect(200)
              .end(function (taxiUpdateErr, taxiUpdateRes) {
                // Handle Taxi update error
                if (taxiUpdateErr) {
                  return done(taxiUpdateErr);
                }

                // Set assertions
                (taxiUpdateRes.body._id).should.equal(taxiSaveRes.body._id);
                (taxiUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Taxis if not signed in', function (done) {
    // Create new Taxi model instance
    var taxiObj = new Taxi(taxi);

    // Save the taxi
    taxiObj.save(function () {
      // Request Taxis
      request(app).get('/api/taxis')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Taxi if not signed in', function (done) {
    // Create new Taxi model instance
    var taxiObj = new Taxi(taxi);

    // Save the Taxi
    taxiObj.save(function () {
      request(app).get('/api/taxis/' + taxiObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', taxi.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Taxi with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/taxis/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Taxi is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Taxi which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Taxi
    request(app).get('/api/taxis/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Taxi with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Taxi if signed in', function (done) {
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

        // Save a new Taxi
        agent.post('/api/taxis')
          .send(taxi)
          .expect(200)
          .end(function (taxiSaveErr, taxiSaveRes) {
            // Handle Taxi save error
            if (taxiSaveErr) {
              return done(taxiSaveErr);
            }

            // Delete an existing Taxi
            agent.delete('/api/taxis/' + taxiSaveRes.body._id)
              .send(taxi)
              .expect(200)
              .end(function (taxiDeleteErr, taxiDeleteRes) {
                // Handle taxi error error
                if (taxiDeleteErr) {
                  return done(taxiDeleteErr);
                }

                // Set assertions
                (taxiDeleteRes.body._id).should.equal(taxiSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Taxi if not signed in', function (done) {
    // Set Taxi user
    taxi.user = user;

    // Create new Taxi model instance
    var taxiObj = new Taxi(taxi);

    // Save the Taxi
    taxiObj.save(function () {
      // Try deleting Taxi
      request(app).delete('/api/taxis/' + taxiObj._id)
        .expect(403)
        .end(function (taxiDeleteErr, taxiDeleteRes) {
          // Set message assertion
          (taxiDeleteRes.body.message).should.match('User is not authorized');

          // Handle Taxi error error
          done(taxiDeleteErr);
        });

    });
  });

  it('should be able to get a single Taxi that has an orphaned user reference', function (done) {
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

          // Save a new Taxi
          agent.post('/api/taxis')
            .send(taxi)
            .expect(200)
            .end(function (taxiSaveErr, taxiSaveRes) {
              // Handle Taxi save error
              if (taxiSaveErr) {
                return done(taxiSaveErr);
              }

              // Set assertions on new Taxi
              (taxiSaveRes.body.name).should.equal(taxi.name);
              should.exist(taxiSaveRes.body.user);
              should.equal(taxiSaveRes.body.user._id, orphanId);

              // force the Taxi to have an orphaned user reference
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

                    // Get the Taxi
                    agent.get('/api/taxis/' + taxiSaveRes.body._id)
                      .expect(200)
                      .end(function (taxiInfoErr, taxiInfoRes) {
                        // Handle Taxi error
                        if (taxiInfoErr) {
                          return done(taxiInfoErr);
                        }

                        // Set assertions
                        (taxiInfoRes.body._id).should.equal(taxiSaveRes.body._id);
                        (taxiInfoRes.body.name).should.equal(taxi.name);
                        should.equal(taxiInfoRes.body.user, undefined);

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
      Taxi.remove().exec(done);
    });
  });
});
