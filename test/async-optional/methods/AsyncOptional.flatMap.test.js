const chai = require('chai');
const {describe, it} = require('mocha');
const AsyncOptional = require('../../../src/AsyncOptional');
const Helper = require('../../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.flatMap()', function () {

  function flatMapper(x) {
    return AsyncOptional.with(x + 1);
  }

  it('should not be called on empty sync optional value', function () {
    let called = {value: false};

    return AsyncOptional.with(null)
      .flatMap(n => {
        called.value = true;
        return flatMapper(n);
      })
      .get()
      .then(value => {
        chai.assert.isFalse(called.value);
        chai.assert.isNull(value);
      });
  });

  it('should not be called on empty async optional value', function () {
    let called = {value: false};

    return AsyncOptional.with(Promise.resolve())
      .flatMap(n => {
        called.value = true;
        return flatMapper(n);
      })
      .get()
      .then(value => {
        chai.assert.isFalse(called.value);
        chai.assert.isNull(value);
      });
  });

  it('should throw on wrong mapper function result with sync value', function () {
    Helper.sync().checkFail(
      () => AsyncOptional.with(DEFINED_VALUE)
        .flatMap(n => {
          return n;
        }),
      TypeError
    );
  });

  it('should throw on wrong mapper function result with async value', function (done) {
    let called = {value: false};

    AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
      .flatMap(n => {
        called.value = true;
        return n;
      })
      .get()
      .catch(e => {
        chai.assert.isTrue(called.value);
        chai.assert.instanceOf(e, TypeError);
        chai.assert.strictEqual(e.message, Helper.ASYNC_TYPE_ERROR_MSG);
        done();
      });
  });

  it('should map data on optional with sync defined value and sync mapper', function () {
    return Helper.async().check(
      AsyncOptional.with(DEFINED_VALUE).flatMap(flatMapper),
      DEFINED_VALUE + 1);
  });


  it('should map data on optional with async defined value and sync mapper', function () {
    return Helper.async().check(
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE)).flatMap(flatMapper),
      DEFINED_VALUE + 1);
  });

  describe('failing cases', function () {
    it('should throw if callback throws (sync value)', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.with(DEFINED_VALUE)
          .flatMap(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });

    it('should throw if callback throws (async value)', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
          .flatMap(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });
  });
});