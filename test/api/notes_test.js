'use strict';

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('JWT tests', function() {
  it('should receive message that password and passwordConfirm do not match', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test@test.com', password: 'Pass123', passwordConfirm: 'Psaa123'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('passwords do not match');
      done();
    });
  });

  it('should receive message that password doesn\'t meet criteria', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test3@test.com', password: 'pass12', passwordConfirm: 'pass12'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('password needs one number, lowercase, and uppercase letter and must be at least six characters');
      done();
    });
  });
});

describe('basic notes crud', function() {
  var id;
  var jwtToken;

  before(function (done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test5@test.com', password: 'Pass123', passwordConfirm: 'Pass123'})
    .end(function (err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should be able to create a note', function(done) {
    chai.request('http://localhost:3000')
    .post('/v1/api/notes')
    .set({'jwt': jwtToken})
    .send({noteBody: 'hello world'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      expect(res.body).to.have.property('_id');
      id = res.body._id;
      done();
    });
  });

  it('should be able to get an index', function(done) {
    chai.request('http://localhost:3000')
    .get('/v1/api/notes')
    .set({'jwt': jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.be.true;
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    .get('/v1/api/notes/' + id)
    .set({'jwt': jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    .put('/v1/api/notes/' + id)
    .set({'jwt': jwtToken})
    .send({noteBody: 'new note body'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note body');
      done();
    });
  });

  it('should be able to destroy a note', function(done) {
    chai.request('http://localhost:3000')
    .delete('/v1/api/notes/' + id)
    .set({'jwt': jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });
});

//Thanks to Stephanie for helping with alterations to note testing (jwt) which includes the 'before' section.
