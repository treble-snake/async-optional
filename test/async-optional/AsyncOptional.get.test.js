const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');
const Helper = require('../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.get()', function () {

  function check(optional, value, done) {
    Helper.checkPromiseResult(optional.get(), value, done);
  }

  it('should return null on empty optional', function (done) {
    check(AsyncOptional.empty(), null, done);
  });

  it('should return null on optional with sync null value', function (done) {
    check(AsyncOptional.with(null), null, done);
  });

  it('should return undefined on optional with sync undefined value', function (done) {
    check(AsyncOptional.with(undefined), undefined, done);
  });

  it('should return null on optional with async null value', function (done) {
    check(AsyncOptional.with(Promise.resolve(null)), null, done);
  });

  it('should return undefined on optional with async undefined value', function (done) {
    check(AsyncOptional.with(Promise.resolve()), undefined, done);
  });

  it('should return true on optional with sync defined value', function (done) {
    check(AsyncOptional.with(DEFINED_VALUE), DEFINED_VALUE, done);
  });

  it('should return true on optional with async defined value', function (done) {
    check(AsyncOptional.with(Promise.resolve(DEFINED_VALUE)), DEFINED_VALUE, done);
  });
});