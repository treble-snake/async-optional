const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.get()', function () {

  it('should return null on empty optional', function (done) {
    AsyncOptional.empty().get()
      .then(value => {
        chai.assert.isNull(value);
        done();
      })
      .catch(done);
  });

  it('should return null on optional with sync null value', function (done) {
    AsyncOptional.with(null).get()
      .then(value => {
        chai.assert.isNull(value);
        done();
      })
      .catch(done);
  });

  it('should return undefined on optional with sync undefined value', function (done) {
    AsyncOptional.with(undefined).get()
      .then(value => {
        chai.assert.isUndefined(value);
        done();
      })
      .catch(done);
  });

  it('should return null on optional with async null value', function (done) {
    AsyncOptional.with(Promise.resolve(null)).get()
      .then(value => {
        chai.assert.isNull(value);
        done();
      })
      .catch(done);
  });

  it('should return undefined on optional with async undefined value', function (done) {
    AsyncOptional.with(Promise.resolve()).get()
      .then(value => {
        chai.assert.isUndefined(value);
        done();
      })
      .catch(done);
  });

  it('should return true on optional with sync defined value', function (done) {
    AsyncOptional.with(DEFINED_VALUE).get()
      .then(value => {
        chai.assert.equal(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });

  it('should return true on optional with async defined value', function (done) {
    AsyncOptional.with(Promise.resolve(DEFINED_VALUE)).get()
      .then(value => {
        chai.assert.equal(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });
});