var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
  noteBody: {type: String}
});

module.exports = mongoose.model('Note', noteSchema);
