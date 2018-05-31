const chai = require('chai');
const {describe, it} = require('mocha');
const Helper = require('../Helper');
const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.statics', function () {

  describe('empty()', function () {
    it('should create optional with null value', function (done) {
      Helper.checkAsyncValue(AsyncOptional.empty(), null, done);
    });
  });

  describe('with()', function () {
    it('should create an optional with sync null value', function (done) {
      Helper.checkAsyncValue(AsyncOptional.with(null), null, done);
    });

    it('should create an with sync undefined value', function (done) {
      Helper.checkAsyncValue(AsyncOptional.with(undefined), undefined, done);
    });

    it('should create an optional with async null value', function (done) {
      Helper.checkAsyncValue(AsyncOptional.with(null), null, done);
    });

    it('should create an optional with async undefined value', function (done) {
      Helper.checkAsyncValue(
        AsyncOptional.with(Promise.resolve()), undefined, done);
    });

    it('should create an optional with sync defined value', function (done) {
      Helper.checkAsyncValue(
        AsyncOptional.with(DEFINED_VALUE), DEFINED_VALUE, done);
    });

    it('should create an optional with async defined value', function (done) {
      Helper.checkAsyncValue(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE)), DEFINED_VALUE, done);
    });
  });

  describe('withEnsured()', function () {

    /**
     * @param {AsyncOptional} optional
     * @param {function} done
     */
    function checkFail(optional, done) {
      // noinspection JSAccessibilityCheck
      optional.asyncValue
        .catch(e => {
          chai.assert.instanceOf(e, TypeError);
          done();
        });
    }

    it('should fail on an optional with sync null value', function (done) {
      checkFail(AsyncOptional.withEnsured(null), done);
    });

    it('should create an with sync undefined value', function (done) {
      checkFail(AsyncOptional.withEnsured(undefined), done);
    });

    it('should create an optional with async null value', function (done) {
      checkFail(AsyncOptional.withEnsured(Promise.resolve(null)), done);
    });

    it('should create an optional with async undefined value', function (done) {
      checkFail(AsyncOptional.withEnsured(Promise.resolve()), done);
    });

    it('should create an optional with sync defined value', function (done) {
      Helper.checkAsyncValue(
        AsyncOptional.withEnsured(DEFINED_VALUE), DEFINED_VALUE, done);
    });

    it('should create an optional with async defined value', function (done) {
      Helper.checkAsyncValue(
        AsyncOptional.withEnsured(Promise.resolve(DEFINED_VALUE)), DEFINED_VALUE, done);
    });
  });
});