const {describe, it} = require('mocha');

const AsyncOptional = require('../../../src/AsyncOptional');
const Helper = require('../../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.hasValue()', function () {

  function check(optional, value) {
    return Helper.async().checkPromiseResult(optional.hasValue(), value);
  }

  it('should return false on empty optional', function () {
    check(AsyncOptional.empty(), false);
  });

  it('should return false on optional with sync null value', function () {
    check(AsyncOptional.with(null), false);
  });

  it('should return false on optional with sync undefined value', function () {
    check(AsyncOptional.with(undefined), false);
  });

  it('should return false on optional with async null value', function () {
    check(AsyncOptional.with(Promise.resolve(null)), false);
  });

  it('should return false on optional with async undefined value', function () {
    check(AsyncOptional.with(Promise.resolve()), false);
  });

  it('should return true on optional with sync defined value', function () {
    check(AsyncOptional.with(DEFINED_VALUE), true);
  });

  it('should return true on optional with async defined value', function () {
    check(AsyncOptional.with(Promise.resolve(DEFINED_VALUE)), true);
  });
});