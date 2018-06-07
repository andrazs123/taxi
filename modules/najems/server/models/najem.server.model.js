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
    type: Date
  },
  trajanje: {
    type: Number
  },
  prekinjen: {
    type: Boolean
  },
  id_taxi: {
    type: String
  }
});

mongoose.model('Najem', NajemSchema);
