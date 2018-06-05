const chai = require('chai');
const {describe, it} = require('mocha');
const AsyncOptional = require('../../../src/AsyncOptional');
const Helper = require('../../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.map()', function () {

  describe('empty cases', function () {
    it('should not be called on optional empty sync value', function () {
      let called = {value: false};
      return Helper.async().checkWithoutCallback(
        AsyncOptional.with(null)
          .map(n => {
            called.value = true;
            return n + 1;
          }),
        null, called
      );
    });

    it('should not be called on optional empty async value', function () {
      let called = {value: false};
      return Helper.async().checkWithoutCallback(
        AsyncOptional.with(Promise.resolve(null))
          .map(n => {
            called.value = true;
            return n + 1;
          }),
        null, called
      );
    });
  });

  describe('non empty cases', function () {
    it('should map a value with sync defined value and sync mapper', function () {
      let called = {value: false};
      return Helper.async().checkWithCallback(
        AsyncOptional.with(DEFINED_VALUE)
          .map(n => {
            called.value = true;
            return n + 1;
          }),
        DEFINED_VALUE + 1, called
      );
    });

    it('should map a value with sync defined value and async mapper', function () {
      let called = {value: false};
      return Helper.async().checkWithCallback(
        AsyncOptional.with(DEFINED_VALUE)
          .map(n => {
            called.value = true;
            return Promise.resolve(n + 1);
          }),
        DEFINED_VALUE + 1, called
      );
    });

    it('should map a value with async defined value and sync mapper', function () {
      let called = {value: false};
      return Helper.async().checkWithCallback(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
          .map(n => {
            called.value = true;
            return n + 1;
          }),
        DEFINED_VALUE + 1, called
      );
    });

    it('should map a value with async defined value and async mapper', function () {
      let called = {value: false};
      return Helper.async().checkWithCallback(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
          .map(n => {
            called.value = true;
            return Promise.resolve(n + 1);
          }),
        DEFINED_VALUE + 1, called
      );
    });

    it('should map a value with several mappers', function () {
      let called = 0;

      const syncMapper = n => {
        called++;
        return n + 1;
      };
      const asyncMapper = n => {
        called++;
        return Promise.resolve(n + 1);
      };

      return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .map(syncMapper)
        .map(asyncMapper)
        .map(syncMapper)
        .map(asyncMapper)
        .get()
        .then(value => {
          chai.assert.strictEqual(called, 4);
          chai.assert.strictEqual(value, DEFINED_VALUE + 4);
        });
    });
  });

  describe('failing cases', function () {
    it('should throw if callback throws (sync value)', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.with(DEFINED_VALUE)
          .map(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });

    it('should throw if callback throws (async value)', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
          .map(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });
  });
});