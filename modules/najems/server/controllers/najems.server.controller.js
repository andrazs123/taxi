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
  console.log('najem update');
  res.jsonp(JSON.stringify(req));

  // tukaj dobiš že iz route najemId
  // let currentDate = new Date.now();
  // let prekinjen = true;
  // ? let najem = {
  //    id: najemId,
  //    currentDate
  //    prekinjen: true
  // }

  // UPDATE najem SET prekinjen = true WHERE najemId = :najemId;
  // mogoče ma moongose update funkcijo; samo spišeš update na varianto zg. sql
  // najem.update({ _id: najemId }, { $set: { prekinjen: true, datum: currentDate }}, function(err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.jsonp(najem);
  //   }
  // });
  // http://mongoosejs.com/docs/documents.html

  // TODO: najt delujoč api za UPDATE

  // var najem = req.najem;
  //
  // najem = _.extend(najem, req.body);
  //
  // najem.save(function (err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.jsonp(najem);
  //   }
  // });
};

/**
 * Delete an Najem
 */
exports.delete = function (req, res) {
  console.log('najem delete');
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
  console.log('najem najemByID');
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Najem is invalid'
    });
  }

  // dobi vse za id taxi
  Najem.find({id_taxi: id}).sort('-datum').exec(function (err, najem) {
    if (err) {
      return next(err);
    } else if (!najem) {
      return res.status(404).send({
        message: 'No Najem with that identifier has been found'
      });
    }
    res.jsonp(najem);
  });
};
