'use strict';

var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
  noteBody: {type: String, validate: [validEntry, 'need a note']}
});

function validEntry(value) {
  if (value) {
    return value.length > 0;
  }
  return false;
}

module.exports = mongoose.model('Note', noteSchema);
