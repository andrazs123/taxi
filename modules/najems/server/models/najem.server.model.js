'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Najem Schema
 */
var NajemSchema = new Schema({
  ime: {
    type: String,
    default: ''
  },
  priimek: {
    type: String,
    default: ''
  },
  podjetje: {
    type: String,
    default: ''
  },
  datum: {
    type: Date,
    default: Date.now()
  },
  trajanje: {
    type: String
  },
  prekinjen: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Najem', NajemSchema);
