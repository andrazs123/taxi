'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Taxi = mongoose.model('Taxi'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Taxi
 */
exports.create = function(req, res) {
  var taxi = new Taxi(req.body);
  taxi.user = req.user;

  taxi.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taxi);
    }
  });
};

/**
 * Show the current Taxi
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var taxi = req.taxi ? req.taxi.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  taxi.isCurrentUserOwner = req.user && taxi.user && taxi.user._id.toString() === req.user._id.toString();

  res.jsonp(taxi);
};

/**
 * Update a Taxi
 */
exports.update = function(req, res) {
  var taxi = req.taxi;

  taxi = _.extend(taxi, req.body);

  taxi.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taxi);
    }
  });
};

/**
 * Delete an Taxi
 */
exports.delete = function(req, res) {
  var taxi = req.taxi;

  taxi.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taxi);
    }
  });
};

/**
 * List of Taxis
 */
exports.list = function(req, res) {
  Taxi.find().exec(function(err, taxis) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(taxis);
    }
  });
};

/**
 * Taxi middleware
 */
exports.taxiByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Taxi is invalid'
    });
  }

  Taxi.findById(id).populate('user', 'displayName').exec(function (err, taxi) {
    if (err) {
      return next(err);
    } else if (!taxi) {
      return res.status(404).send({
        message: 'No Taxi with that identifier has been found'
      });
    }
    req.taxi = taxi;
    next();
  });
};
