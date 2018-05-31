const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');
const Helper = require('../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.isPresent()', function () {

  function check(optional, value, done) {
    Helper.checkPromiseResult(optional.isPresent(), value, done);
  }

  it('should return false on empty optional', function (done) {
    check(AsyncOptional.empty(), false, done);
  });

  it('should return false on optional with sync null value', function (done) {
    check(AsyncOptional.with(null), false, done);
  });

  it('should return false on optional with sync undefined value', function (done) {
    check(AsyncOptional.with(undefined), false, done);
  });

  it('should return false on optional with async null value', function (done) {
    check(AsyncOptional.with(Promise.resolve(null)), false, done);
  });

  it('should return false on optional with async undefined value', function (done) {
    check(AsyncOptional.with(Promise.resolve()), false, done);
  });

  it('should return true on optional with sync defined value', function (done) {
    check(AsyncOptional.with(DEFINED_VALUE), true, done);
  });

  it('should return true on optional with async defined value', function (done) {
    check(AsyncOptional.with(Promise.resolve(DEFINED_VALUE)), true, done);
  });
});