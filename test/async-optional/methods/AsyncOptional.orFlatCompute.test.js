const {describe, it} = require('mocha');
const AsyncOptional = require('../../../src/AsyncOptional');
const Helper = require('../../Helper');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('AsyncOptional.orFlatCompute()', function () {

  function createAnotherOptional() {
    return AsyncOptional.with(777);
  }

  describe('with synk value', function () {
    it('should be called on empty optional', function () {
      let called = {value: false};
      return Helper.async().checkWithCallback(
        AsyncOptional.empty()
          .orFlatCompute(() => {
            called.value = true;
            return createAnotherOptional();
          }),
        ANOTHER_VALUE, called);
    });

    it('should not be called on optional with sync defined value', function () {
      let called = {value: false};
      return Helper.async().checkWithoutCallback(
        AsyncOptional.with(DEFINED_VALUE)
          .orFlatCompute(() => {
            called.value = true;
            return createAnotherOptional();
          }),
        DEFINED_VALUE, called);
    });

    it('should throw on wrong supplier result and optional with sync value', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.empty()
          .orFlatCompute(() => {
            return ANOTHER_VALUE;
          }),
        TypeError
      );
    });
  });

  describe('with asynk value', function () {
    it('should be called on optional with async empty value', function () {
      let called = {value: false};
      return Helper.async().checkWithCallback(
        AsyncOptional.with(Promise.resolve())
          .orFlatCompute(() => {
            called.value = true;
            return createAnotherOptional();
          }),
        ANOTHER_VALUE, called);
    });

    it('should not be called on optional with async defined value', function () {
      let called = {value: false};
      return Helper.async().checkWithoutCallback(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
          .orFlatCompute(() => {
            called.value = true;
            return createAnotherOptional();
          }),
        DEFINED_VALUE, called);
    });


    it('should throw on wrong supplier result and optional with async value', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve())
          .orFlatCompute(() => {
            return ANOTHER_VALUE;
          }),
        TypeError
      );
    });
  });

  describe('failing cases', function () {
    it('should throw if callback throws (sync value)', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.with(null)
          .orFlatCompute(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });

    it('should throw if callback throws (async value)', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve())
          .orFlatCompute(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });
  });
});