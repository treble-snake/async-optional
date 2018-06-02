const {describe, it} = require('mocha');
const AsyncOptional = require('../../../src/AsyncOptional');
const Helper = require('../../Helper');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('AsyncOptional.orCompute()', function () {

  it('should call sync supplier on sync empty optional value', function () {
    let called = {value: false};
    return Helper.async().checkWithCallback(
      AsyncOptional.with(null)
        .orCompute(() => {
          called.value = true;
          return ANOTHER_VALUE;
        }),
      ANOTHER_VALUE, called
    );
  });

  it('should call async supplier on sync empty optional value', function () {
    let called = {value: false};
    return Helper.async().checkWithCallback(
      AsyncOptional.with(null)
        .orCompute(() => {
          called.value = true;
          return Promise.resolve(ANOTHER_VALUE);
        }),
      ANOTHER_VALUE, called
    );
  });

  it('should call sync supplier on async empty optional value', function () {
    let called = {value: false};
    return Helper.async().checkWithCallback(
      AsyncOptional.with(Promise.resolve())
        .orCompute(() => {
          called.value = true;
          return ANOTHER_VALUE;
        }),
      ANOTHER_VALUE, called
    );
  });

  it('should call async supplier on async empty optional value', function () {
    let called = {value: false};
    return Helper.async().checkWithCallback(
      AsyncOptional.with(Promise.resolve())
        .orCompute(() => {
          called.value = true;
          return Promise.resolve(ANOTHER_VALUE);
        }),
      ANOTHER_VALUE, called
    );
  });

  it('should throw if supplier is not a function (sync value)', function () {
    Helper.sync().checkFail(
      () => AsyncOptional.empty().orCompute(ANOTHER_VALUE),
      TypeError
    );
  });

  it('should throw if supplier is not a function (async value)', function () {
    return Helper.async().checkFail(
      AsyncOptional.with(Promise.resolve())
        .orCompute(ANOTHER_VALUE),
      TypeError
    );
  });

  it('should not be called on optional with sync defined value', function () {
    let called = {value: false};
    return Helper.async().checkWithoutCallback(
      AsyncOptional.with(DEFINED_VALUE)
        .orCompute(() => {
          called.value = true;
          return ANOTHER_VALUE;
        }),
      DEFINED_VALUE, called
    );
  });

  it('should not be called on optional with async defined value', function () {
    let called = {value: false};
    return Helper.async().checkWithoutCallback(
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .orCompute(() => {
          called.value = true;
          return ANOTHER_VALUE;
        }),
      DEFINED_VALUE, called
    );
  });

  describe('failing cases', function () {
    it('should throw if callback throws (sync value)', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.with(null)
          .orCompute(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });

    it('should throw if callback throws (async value)', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve())
          .orCompute(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });
  });
});