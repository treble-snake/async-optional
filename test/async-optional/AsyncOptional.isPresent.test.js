const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.isPresent()', function () {

  describe('isPresent()', function () {
    it('should return false on empty optional', function (done) {
      AsyncOptional.empty().isPresent()
        .then(value => {
          chai.assert.isFalse(value);
          done();
        })
        .catch(done);
    });

    it('should return false on optional with sync null value', function (done) {
      AsyncOptional.with(null).isPresent()
        .then(value => {
          chai.assert.isFalse(value);
          done();
        })
        .catch(done);
    });

    it('should return false on optional with sync undefined value', function (done) {
      AsyncOptional.with(undefined).isPresent()
        .then(value => {
          chai.assert.isFalse(value);
          done();
        })
        .catch(done);
    });

    it('should return false on optional with async null value', function (done) {
      AsyncOptional.with(Promise.resolve(null)).isPresent()
        .then(value => {
          chai.assert.isFalse(value);
          done();
        })
        .catch(done);
    });

    it('should return false on optional with async undefined value', function (done) {
      AsyncOptional.with(Promise.resolve()).isPresent()
        .then(value => {
          chai.assert.isFalse(value);
          done();
        })
        .catch(done);
    });

    it('should return true on optional with sync defined value', function (done) {
      AsyncOptional.with(DEFINED_VALUE).isPresent()
        .then(value => {
          chai.assert.isTrue(value);
          done();
        })
        .catch(done);
    });

    it('should return true on optional with async defined value', function (done) {
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE)).isPresent()
        .then(value => {
          chai.assert.isTrue(value);
          done();
        })
        .catch(done);
    });
  });
});