'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var app = express();

var url = process.env.MONGOHQ_URL || process.env.MONGOLAB_URI;

app.use(bodyparser.json());

mongoose.connect(url);

require('./routes/notes_routes')(app);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
