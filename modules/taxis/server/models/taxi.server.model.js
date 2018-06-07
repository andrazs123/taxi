'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Taxi Schema
 */
var TaxiSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Taxi name',
    trim: true
  },
  leto_izdelave: {
    type: Number,
    default: ''
  },
  max_potniki: {
    type: Number,
    default: ''
  },
  max_hitrost: {
    type: Number,
    default: ''
  },
  path_slike: {
    type: String,
    default: ''
  },
  datum_nastanka: {
    type: Date
  }
});

mongoose.model('Taxi', TaxiSchema);
