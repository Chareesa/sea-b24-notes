'use strict';

module.exports = function() {
  return function(req, res, next) {
    if (req.decoded.expire < Date.now()) res.status(403).send('please relogin');

    if (req.user.basic.group === 'admin') {
      console.log('user is admin');
    } else {
      console.log('user is not admin');
    }
    next();
  };
};
