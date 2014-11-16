'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
//ANOTHER option for jwt expiration:
// var moment = require('moment');

var userSchema = mongoose.Schema({
  basic: {
    email: String,
    password: String,
    group: String
  }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.basic.password);
};

userSchema.methods.generateToken = function(secret) {
  //ANOTHER option for jwt expiration:
  // var expires = moment().add(10, 'seconds').valueOf();
  var self = this;
  var token = jwt.encode({
    iss: self._id,
    // exp: expires
  }, secret);
  return token;
};

module.exports = mongoose.model('User', userSchema);

//idea for expiration:
//http://www.sitepoint.com/using-json-web-tokens-node-js/
