const {describe, it} = require('mocha');

const AsyncOptional = require('../../../src/AsyncOptional');
const Helper = require('../../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.get()', function () {

  function check(optional, value) {
    return Helper.async().checkPromiseResult(optional.get(), value);
  }

  it('should return null on empty optional', function () {
    check(AsyncOptional.empty(), null);
  });

  it('should return null on optional with sync null value', function () {
    check(AsyncOptional.with(null), null);
  });

  it('should return undefined on optional with sync undefined value', function () {
    check(AsyncOptional.with(undefined), undefined);
  });

  it('should return null on optional with async null value', function () {
    check(AsyncOptional.with(Promise.resolve(null)), null);
  });

  it('should return undefined on optional with async undefined value', function () {
    check(AsyncOptional.with(Promise.resolve()), undefined);
  });

  it('should return true on optional with sync defined value', function () {
    check(AsyncOptional.with(DEFINED_VALUE), DEFINED_VALUE);
  });

  it('should return true on optional with async defined value', function () {
    check(AsyncOptional.with(Promise.resolve(DEFINED_VALUE)), DEFINED_VALUE);
  });
});