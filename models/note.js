'use strict';

var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
  noteBody: {type: String, validate: [validEntry, 'need a note']},
  // OTHER OPTIONS
  // firstName: {type: String, validate: [validEntry, 'need a firstName']},
  // lastName: {type: String},
  // age: {type: Number}
});

function validEntry(value) {
  if (value) {
    return value.length > 0;
  }
  return false;
}

module.exports = mongoose.model('Note', noteSchema);
