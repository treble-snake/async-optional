const {describe, it} = require('mocha');
const Helper = require('../../Helper');
const AsyncOptional = require('../../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.statics', function () {

  describe('empty()', function () {
    it('should create optional with null value', function () {
      return Helper.async().check(AsyncOptional.empty(), null);
    });
  });

  describe('with()', function () {
    it('should create an optional with sync null value', function () {
      return Helper.async().check(AsyncOptional.with(null), null);
    });

    it('should create an with sync undefined value', function () {
      return Helper.async().check(AsyncOptional.with(undefined), undefined);
    });

    it('should create an optional with async null value', function () {
      return Helper.async().check(AsyncOptional.with(Promise.resolve(null)), null);
    });

    it('should create an optional with async undefined value', function () {
      return Helper.async().check(
        AsyncOptional.with(Promise.resolve()), undefined);
    });

    it('should create an optional with sync defined value', function () {
      return Helper.async().check(AsyncOptional.with(DEFINED_VALUE), DEFINED_VALUE);
    });

    it('should create an optional with async defined value', function () {
      return Helper.async().check(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE)), DEFINED_VALUE);
    });
  });

  describe('withEnsured()', function () {

    it('should fail on a sync null value', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.withEnsured(null), TypeError);
    });

    it('should fail on a sync undefined value', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.withEnsured(undefined), TypeError);
    });

    it('should fail on an async null value', function () {
      return Helper.async().checkFail(
        AsyncOptional.withEnsured(Promise.resolve(null)), TypeError);
    });

    it('should fail on aт async undefined value', function () {
      return Helper.async().checkFail(
        AsyncOptional.withEnsured(Promise.resolve()), TypeError);
    });

    it('should create an optional with sync defined value', function () {
      return Helper.async().check(
        AsyncOptional.withEnsured(DEFINED_VALUE), DEFINED_VALUE);
    });

    it('should create an optional with async defined value', function () {
      return Helper.async().check(
        AsyncOptional.withEnsured(Promise.resolve(DEFINED_VALUE)), DEFINED_VALUE);
    });
  });
});