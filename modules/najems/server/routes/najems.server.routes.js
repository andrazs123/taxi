'use strict';

/**
 * Module dependencies
 */
var najemsPolicy = require('../policies/najems.server.policy'),
  najems = require('../controllers/najems.server.controller');

module.exports = function (app) {
  // Najems Routes
  app.route('/api/najems').all(najemsPolicy.isAllowed)
    .get(najems.list)
    .post(najems.create);

  app.route('/api/najems/:najemId')
  // TODO: vklopi nazaj za produkcijo
    .all(najemsPolicy.isAllowed)
    // .get(najems.read)
    .get(najems.najemByID)
    .put(najems.update)
    .delete(najems.delete);

  // Finish by binding the Najem middleware
  app.param('najemId', najems.najemByID);
};
