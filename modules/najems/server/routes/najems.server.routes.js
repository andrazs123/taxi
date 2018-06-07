'use strict';

/**
 * Module dependencies
 */
var najemsPolicy = require('../policies/najems.server.policy'),
  najems = require('../controllers/najems.server.controller');

module.exports = function (app) {
  // Najems Routes
  app.route('/api/najems')
    .all(najemsPolicy.isAllowed)
    .get(najems.list)
    .post(najems.create);

  // route za get po taxi idju
  app.route('/api/najems/:taxiId')
  //.all(najemsPolicy.isAllowed)
  // .get(najems.read)
    .get(najems.najemByID)

  //.put(najems.update)
  //.delete(najems.delete)
  ;

  app.route('/api/najems/:najemId')
  //.all(najemsPolicy.isAllowed)
  // .get(najems.read)
    .post(najems.create);


  app.route('/api/najems/:najemIdPut')
  //.all(najemsPolicy.isAllowed)
  // .get(najems.read)
    .put(najems.update);

  // Finish by binding the Najem middleware
  app.param('taxiId', najems.najemByID);
  app.param('najemId', najems.create);
  app.param('najemIdPut', najems.update);
};
