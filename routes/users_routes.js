'use strict';

var User = require('../models/user');

module.exports = function(app, passport) {
  var needsGroup = function(group) {
    return [
      passport.authenticate('basic', {session: false}),
      function(req, res, next) {
        if (req.user && req.user.basic.group === group) {
          next();
        }
        else {
          res.status(401).send('Unauthorized');
        }
      }
    ];
  };

  app.get('/api/admin', needsGroup('admin'), function(req, res) {
    res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
  });

  app.get('/api/users', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
  });

  app.post('/api/users', function(req, res) {
    var email = new Buffer(req.body.email, 'base64').toString('ascii');
    var password = new Buffer(req.body.password, 'base64').toString('ascii');
    var passwordConfirmation = new Buffer(req.body.passwordConfirmation, 'base64').toString('ascii');
    var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    User.findOne({'basic.email': email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot create that user');

      if (password !== passwordConfirmation) return res.status(500).send('passwords do not match');
      if (!regex.test(password) || !password) {
        return res.status(500).send('password needs one number, lowercase, and uppercase letter and must be at least six characters');
      }

      var newUser = new User();
      newUser.basic.email = email;
      newUser.basic.password = newUser.generateHash(password);
      newUser.basic.group = req.body.group;
      newUser.save(function(err) {
        if (err) return res.status(500).send('server error');
        res.json({jwt: newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });
};

//idea for groups:
//http://stackoverflow.com/questions/15719116/verify-access-group-in-passport-js

//regex source:
//http://www.the-art-of-web.com/javascript/validate-password/
