'use strict';

require('../../app/js/client.js');
require('angular-mocks');

describe('NotesController', function() {
  var $controllerConstructor;
  var $scope;
  var $cookies = {jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDgyODg2OTA5ODdlOGQ5N2RkYmE2MmIifQ.0sVSeEGon3aNcyURfz2dDiGoiFrgvvePIlnKQvAWPRg'};

  beforeEach(angular.mock.module('notesApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  it('should create a controller', function() {
    var notesController = $controllerConstructor('notesCtrl', {$scope: $scope});
    expect(typeof notesController).toBe('object');
  });

  describe('signing out', function() {
    beforeEach(angular.mock.inject(function() {
      $controllerConstructor('notesCtrl', {$scope: $scope, $cookies: $cookies});
    }));

    it('should sign the user out', function() {
      $scope.signOut();
      expect($cookies.jwt).toBe(undefined);
    });

  });
});
