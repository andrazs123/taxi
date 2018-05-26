'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Najem = mongoose.model('Najem'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Najem
 */
exports.create = function(req, res) {
  var najem = new Najem(req.body);
  najem.user = req.user;

  najem.save(function(err) {
    console.log('najem save', err);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(najem);
    }
  });
};

/**
 * Show the current Najem
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var najem = req.najem ? req.najem.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  najem.isCurrentUserOwner = req.user && najem.user && najem.user._id.toString() === req.user._id.toString();

  res.jsonp(najem);
};

/**
 * Update a Najem
 */
exports.update = function (req, res) {
  var najem = req.najem;

  najem = _.extend(najem, req.body);

  najem.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(najem);
    }
  });
};

/**
 * Delete an Najem
 */
exports.delete = function (req, res) {
  var najem = req.najem;

  najem.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(najem);
    }
  });
};

/**
 * List of Najems
 */
exports.list = function (req, res) {
  Najem.find().sort('-created').populate('user', 'displayName').exec(function (err, najems) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(najems);
    }
  });
};

/**
 * Najem middleware
 */
exports.najemByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Najem is invalid'
    });
  }

  // dobi vse za id taxi
  Najem.find({id_taxi: id}).sort('-datum').exec(function (err, najem) {
    // iskanje samo zadnjega z apijem
    //Najem.findOne({id_taxi: id}, {}, {sort: {'datum': 'asc'}}).exec(function (err, najem) {
    // Najem.findById(id).populate('user', 'displayName').exec(function (err, najem) {
    if (err) {
      return next(err);
    } else if (!najem) {
      return res.status(404).send({
        message: 'No Najem with that identifier has been found'
      });
    }
    res.jsonp(najem);
    // req.najem = najem;
    // next();
  });
};
