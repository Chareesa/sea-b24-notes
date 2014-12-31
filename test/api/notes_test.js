'use strict';

var mongoose = require('mongoose');
process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

before(function(done) {
  mongoose.connection.collections['users'].drop(function(err) {
    if (err) console.log(err);
    done();
  });
});

describe('JWT tests', function() {
  var id;
  var token;

  it('should receive message that password doesn\'t meet criteria', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email:'Y2hhcmVlc2FncmFoYW1AZ21haWwuY29t', password:'dGVzdA==', passwordConfirmation: 'dGVzdA==', group:'admin'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('password needs one number, lowercase, and uppercase letter and must be at least six characters');
      done();
    });
  });

  it('should receive message that passwords do not match', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email:'Y2hhcmVlc2FncmFoYW1AZ21haWwuY29t', password:'VGVzdDEyNQ==', passwordConfirmation: 'dGVzdA==', group:'admin'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.text).to.eql('passwords do not match');
      done();
    });
  });

  it('should create user', function(done) {
    chai.request('http://localhost:3000')
      .post('/api/users')
      .send({email:'Y2hhcmVlc2FncmFoYW1AZ21haWwuY29t', password:'VGVzdDEyNQ==', passwordConfirmation: 'VGVzdDEyNQ==', group:'admin'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('jwt');
        token = res.body.jwt;
        done();
      });
  });

  it('should not create duplicate user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email:'Y2hhcmVlc2FncmFoYW1AZ21haWwuY29t', password:'VGVzdDEyNQ==', passwordConfirmation: 'VGVzdDEyNQ==', group:'admin'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.status).to.eql(500);
      done();
    });
  });

  it('should be able to create a note', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/notes')
    .set({jwt:token})
    .send({noteBody:"hello world"})
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
    .get('/api/notes')
    .set({jwt:token})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.be.true;
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/notes/' + id)
    .set({jwt:token})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    .put('/api/notes/' + id)
    .set({jwt:token})
    .send({noteBody: 'new note body'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note body');
      done();
    });
  });

  it('should be able to destroy a note', function(done) {
    chai.request('http://localhost:3000')
    .delete('/api/notes/' + id)
    .set({jwt:token})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });
});

//Thanks to Stephanie for helping with alterations to note testing (jwt) which includes the 'before' section.
