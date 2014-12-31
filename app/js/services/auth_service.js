'use strict';

/*jshint sub:true*/

module.exports = function(app) {
  app.factory('ResourceAuth', ['$location', function($location) {
    return function() {
      return {
        signOut: function($cookies) {
          delete $cookies.jwt;
          return $location.path('/users');
        },

        signedIn: function($cookies) {
          if (!$cookies.jwt || !$cookies.jwt.length) return $location.path('/users');
        }
      };
    };
  }]);
};
