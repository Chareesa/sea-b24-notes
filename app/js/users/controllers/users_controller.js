'use strict';
/*jshint sub:true*/

module.exports = function(app) {
  app.controller('UsersCtrl', ['$scope', '$http', '$cookies', '$base64', '$location', function($scope, $http, $cookies, $base64, $location) {
    $scope.errors = [];

    $scope.login = function() {
      $scope.errors = [];
      $http.defaults.headers.common['Authorization'] = 'Basic' + $base64.encode($scope.user.email + ':' + $scope.user.password);
      $http({
        method: 'GET',
        url: '/api/users'
      })
  .success(function(data) {
    console.log('success');
    $cookies.jwt = data.jwt;
    $location.path('/notes');
  })
  .error(function(data) {
    console.log('error!');
    console.log(data);
    $scope.errors.push(data);
  });
    };

    $scope.signUp = function() {
      $scope.errors = [];
      if ($scope.newUser.password !== $scope.newUser.passwordConfirmation) $scope.errors.push({msg: 'passwords do not match'});
      if (!$scope.newUser.email) $scope.errors.push({msg: 'email was not entered'});
      if ($scope.errors.length) return;
      $scope.newUser.email = $base64.encode($scope.newUser.email);
      $scope.newUser.password = $base64.encode($scope.newUser.password);
      $scope.newUser.passwordConfirmation = $base64.encode($scope.newUser.passwordConfirmation);
      $http({
        method: 'POST',
        url: '/api/users',
        data: $scope.newUser
      })
      .success(function(data) {
        console.log('success!');
        $cookies.jwt = data.jwt;
        $location.path('/notes');
      })
      .error(function(data) {
        console.log(data);
        $scope.errors.push(data);
      });
    };
  }]);
};
