const chai = require('chai');
const {describe, it} = require('mocha');
const Helper = require('../../Helper');
const AsyncOptional = require('../../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.ifAbsent()', function () {

  it('should call function on empty sync optional value', function () {
    let called = {value: false};

    return AsyncOptional.with(null)
      .ifAbsent(() => {
        called.value = true;
      })
      .then(() => {
        chai.assert.isTrue(called.value);
      });
  });

  it('should call function on empty sync optional value', function () {
    let called = {value: false};

    return AsyncOptional.with(Promise.resolve())
      .ifAbsent(() => {
        called.value = true;
      })
      .then(() => {
        chai.assert.isTrue(called.value);
      });
  });

  it('should not call function on sync value', function () {
    let called = {value: false};

    return AsyncOptional.with(DEFINED_VALUE)
      .ifAbsent(() => {
        called.value = true;
      })
      .then(() => {
        chai.assert.isFalse(called.value);
      });
  });

  it('should not call function on async value', function () {
    let called = {value: false};

    return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
      .ifAbsent(() => {
        called.value = true;
      })
      .then(() => {
        chai.assert.isFalse(called.value);
      });
  });

  describe('failing cases', function () {
    it('should throw if callback throws (sync value)', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.with(null)
          .ifAbsent(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });

    it('should throw if callback throws (async value)', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve())
          .ifAbsent(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });
  });
});