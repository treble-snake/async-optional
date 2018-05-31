const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');
const Helper = require('../Helper');

const DEFINED_VALUE = 42;
const DEFAULT_VALUE = 8;

describe('AsyncOptional.getOrCompute()', function () {

  function check(optional, value, done) {
    Helper.checkPromiseResult(
      optional.getOrCompute(() => DEFAULT_VALUE), value, done);
  }

  it('should return default value on empty optional', function (done) {
    check(AsyncOptional.empty(), DEFAULT_VALUE, done);
  });

  it('should return default value on optional with sync null value', function (done) {
    check(AsyncOptional.with(null), DEFAULT_VALUE, done);
  });

  it('should return default value on optional with sync undefined value', function (done) {
    check(AsyncOptional.with(undefined), DEFAULT_VALUE, done);
  });

  it('should return default value on optional with async null value', function (done) {
    check(AsyncOptional.with(Promise.resolve(null)), DEFAULT_VALUE, done);
  });

  it('should return default value on optional with async undefined value', function (done) {
    check(AsyncOptional.with(Promise.resolve()), DEFAULT_VALUE, done);
  });

  it('should return defined value on optional with sync defined value', function (done) {
    check(AsyncOptional.with(DEFINED_VALUE), DEFINED_VALUE, done);
  });

  it('should return defined value on optional with async defined value', function (done) {
    check(AsyncOptional.with(Promise.resolve(DEFINED_VALUE)), DEFINED_VALUE, done);
  });
});