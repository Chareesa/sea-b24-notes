'use strict';
/*jshint sub:true*/

module.exports = function(app) {
  app.controller('notesCtrl', ['$scope', '$http', 'ResourceAuth', 'ResourceBackend', '$cookies', '$location', function($scope, $http, ResourceAuth, ResourceBackend, $cookies, $location) {
    var notesBackend = new ResourceBackend('notes');
    var auth = new ResourceAuth();

    auth.signedIn($cookies);

    $http.defaults.headers.common['jwt'] = $cookies.jwt;

    $scope.index = function() {
      auth.signedIn($cookies);
      notesBackend.index()
      .success(function(data) {
        $scope.notes = data;
      });
    };

    $scope.saveNewNote = function(newNote) {
      auth.signedIn($cookies);
      notesBackend.saveNew(newNote)
      .success(function(data) {
        $scope.notes.push(data);
        $scope.newNote = null;
      });
    };

    $scope.saveNote = function(note) {
      auth.signedIn($cookies);
      notesBackend.save(note)
      .success(function(data) {
        note.editing = false;
      });
    };

    $scope.deleteNote = function(note) {
      auth.signedIn($cookies);
      notesBackend.delete(note)
      .success(function() {
        $scope.notes.splice($scope.notes.indexOf(note), 1);
      });
    };

    $scope.signOut = function() {
      auth.signOut($cookies);
    };
  }]);
};
