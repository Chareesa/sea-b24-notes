'use strict';

var Note = require('../models/note');

// Note.schema.path('noteBody').require(true, 'You need a string');

Note.schema.path('noteBody').required(true, 'need a string!');
Note.schema.path('firstName').required(true, 'need a string!');

module.exports = function(app) {
  app.get('/api/notes', function(req ,res) {
    Note.find({}, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  app.get('/', function(req, res) {
    res.json({"msg": "well hello there!"});
  });

  app.get('/api/notes/:id', function(req, res) {
    Note.findOne({'_id': req.params.id}, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  app.get('/api/notes/first/:firstLetterFirstName', function(req, res) {
    var firstLetterFirstNameRegex = new RegExp('^' + req.params.firstLetterFirstName + '$', 'i');
    Note.find({'firstName': { $regex: firstLetterFirstNameRegex }}, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  app.post('/api/notes', function(req, res) {
    var note = new Note(req.body);
    note.save(function(err, data) {
      if (err) return res.status(500).send(err.errors);
      res.json(data);
    });
  });

  app.put('/api/notes/:id', function(req, res) {
    var note = req.body;
    delete note._id;
    Note.findOneAndUpdate({'_id': req.params.id}, note, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  app.delete('/api/notes/:id', function(req, res) {
    Note.remove({'_id': req.params.id}, function(err) {
      if (err) return res.status(500).send('there was an error');
      res.json({msg: 'success!'});
    });
  });
};
