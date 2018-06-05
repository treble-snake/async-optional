const {describe, it} = require('mocha');

const AsyncOptional = require('../../../src/AsyncOptional');
const Helper = require('../../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.isEmpty()', function () {

  function check(optional, value) {
    return Helper.async().checkPromiseResult(optional.isEmpty(), value);
  }

  it('should return true on empty optional', function () {
    check(AsyncOptional.empty(), true);
  });

  it('should return true on optional with sync null value', function () {
    check(AsyncOptional.with(null), true);
  });

  it('should return true on optional with sync undefined value', function () {
    check(AsyncOptional.with(undefined), true);
  });

  it('should return true on optional with async null value', function () {
    check(AsyncOptional.with(Promise.resolve(null)), true);
  });

  it('should return true on optional with async undefined value', function () {
    check(AsyncOptional.with(Promise.resolve()), true);
  });

  it('should return false on optional with sync defined value', function () {
    check(AsyncOptional.with(DEFINED_VALUE), false);
  });

  it('should return false on optional with async defined value', function () {
    check(AsyncOptional.with(Promise.resolve(DEFINED_VALUE)), false);
  });
});