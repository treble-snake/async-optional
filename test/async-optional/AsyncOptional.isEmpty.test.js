const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');
const Helper = require('../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.isEmpty()', function () {

  function check(optional, value, done) {
    Helper.checkPromiseResult(optional.isEmpty(), value, done);
  }

  it('should return true on empty optional', function (done) {
    check(AsyncOptional.empty(), true, done);
  });

  it('should return true on optional with sync null value', function (done) {
    check(AsyncOptional.with(null), true, done);
  });

  it('should return true on optional with sync undefined value', function (done) {
    check(AsyncOptional.with(undefined), true, done);
  });

  it('should return true on optional with async null value', function (done) {
    check(AsyncOptional.with(Promise.resolve(null)), true, done);
  });

  it('should return true on optional with async undefined value', function (done) {
    check(AsyncOptional.with(Promise.resolve()), true, done);
  });

  it('should return false on optional with sync defined value', function (done) {
    check(AsyncOptional.with(DEFINED_VALUE), false, done);
  });

  it('should return false on optional with async defined value', function (done) {
    check(AsyncOptional.with(Promise.resolve(DEFINED_VALUE)), false, done);
  });
});