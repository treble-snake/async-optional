const chai = require('chai');
const {describe, it} = require('mocha');
const AsyncOptional = require('../../src/AsyncOptional');
const Helper = require('../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.flatMap()', function () {

  function flatMapper(x) {
    return AsyncOptional.with(x + 1);
  }

  function asyncFlatMapper(x) {
    return Promise.resolve(AsyncOptional.with(x + 1));
  }

  it('should not be called on empty optional', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.empty()
      .flatMap(n => {
        called = true;
        return flatMapper(n);
      })
      .asyncValue
      .then(value => {
        chai.assert.isFalse(called);
        chai.assert.isNull(value);
        done();
      })
      .catch(done);
  });

  it('should throw on wrong mapper function result', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.with(DEFINED_VALUE)
      .flatMap(n => {
        called = true;
        return n;
      })
      .asyncValue
      .catch(e => {
        chai.assert.isTrue(called);
        chai.assert.instanceOf(e, TypeError);
        chai.assert.strictEqual(e.message, 'Flat mapper did not return an AsyncOptional');
        done();
      });
  });

  it('should map data on optional with sync defined value and sync mapper', function (done) {
    Helper.checkAsyncValue(
      AsyncOptional.with(DEFINED_VALUE).flatMap(flatMapper),
      DEFINED_VALUE + 1, done);
  });


  it('should map data on optional with async defined value and sync mapper', function (done) {
    Helper.checkAsyncValue(
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE)).flatMap(flatMapper),
      DEFINED_VALUE + 1, done);
  });

  it('should map data on optional with sync defined value and async mapper', function (done) {
    Helper.checkAsyncValue(
      AsyncOptional.with(DEFINED_VALUE).flatMap(asyncFlatMapper),
      DEFINED_VALUE + 1, done);
  });


  it('should map data on optional with async defined value and async mapper', function (done) {
    Helper.checkAsyncValue(
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE)).flatMap(asyncFlatMapper),
      DEFINED_VALUE + 1, done);
  });
});