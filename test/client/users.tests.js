'use strict';

require('../../app/js/users/controllers/users_controller');
require('../../app/js/client');
require('angular-mocks');

describe('resource service', function() {
  beforeEach(angular.mock.module('notesApp'));
  var $controllerConstructor;
  var $httpBackend;
  var $scope;
  var $cookies;
  var jwt = {jwt: 'ieksuperleifksecretlki'};

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  it('should create a controller', function() {
    var userController = $controllerConstructor('UsersCtrl', {$scope:$scope});
    expect(typeof userController).toBe('object');
  });

  describe('rest request', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $cookies = {};
      $controllerConstructor('UsersCtrl', {$scope: $scope, $cookies: $cookies});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should create a user', function() {
      $httpBackend.expectPOST('/api/users').respond(200, jwt);
      $scope.newUser = {email: 'testUser@test.com', password:'Test123', passwordConfirmation: 'Test123'};
      $scope.signUp();

      $httpBackend.flush();

      expect($cookies.jwt).toEqual('ieksuperleifksecretlki');
    });

    it('should make a GET request to users', function() {
      $httpBackend.expectGET('/api/users').respond(200, jwt);
      $scope.user = {email: 'testUser@test.com'};
      $scope.login();

      $httpBackend.flush();

      expect($cookies.jwt).toEqual('ieksuperleifksecretlki');
    });
  });
});
