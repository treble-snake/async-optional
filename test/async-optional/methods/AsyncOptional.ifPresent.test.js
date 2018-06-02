const chai = require('chai');
const {describe, it} = require('mocha');
const Helper = require('../../Helper');
const AsyncOptional = require('../../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.ifPresent()', function () {

  it('should not call function on empty sync optional value', function () {
    let called = {value: false};

    return AsyncOptional.with(null)
      .ifPresent(() => {
        called.value = true;
      })
      .then(() => {
        chai.assert.isFalse(called.value);
      });
  });

  it('should not call function on empty async optional value', function () {
    let called = {value: false};

    return AsyncOptional.with(Promise.resolve())
      .ifPresent(() => {
        called.value = true;
      })
      .then(() => {
        chai.assert.isFalse(called.value);
      });
  });

  it('should call function on sync value', function () {
    let called = {value: false};
    let value;

    return AsyncOptional.with(DEFINED_VALUE)
      .ifPresent(n => {
        called.value = true;
        value = n;
      })
      .then(() => {
        chai.assert.isTrue(called.value);
        chai.assert.strictEqual(value, DEFINED_VALUE);
      });
  });

  it('should call function on async value', function () {
    let called = {value: false};
    let value;

    return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
      .ifPresent(n => {
        called.value = true;
        value = n;
      })
      .then(() => {
        chai.assert.isTrue(called.value);
        chai.assert.strictEqual(value, DEFINED_VALUE);
      });
  });

  describe('failing cases', function () {
    it('should throw if callback throws (sync value)', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.with(DEFINED_VALUE)
          .ifPresent(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });

    it('should throw if callback throws (async value)', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
          .ifPresent(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });
  });
});