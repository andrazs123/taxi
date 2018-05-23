'use strict';

/**
 * Module dependencies
 */
var taxisPolicy = require('../policies/taxis.server.policy'),
  taxis = require('../controllers/taxis.server.controller');

module.exports = function(app) {
  // Taxis Routes
  app.route('/api/taxis').all(taxisPolicy.isAllowed)
    .get(taxis.list)
    .post(taxis.create);

  app.route('/api/taxis/:carId').all(taxisPolicy.isAllowed)
    .get(taxis.read)
    .put(taxis.update)
    .delete(taxis.delete);

  // Finish by binding the Taxi middleware
  app.param('carId', taxis.taxiByID);
};
