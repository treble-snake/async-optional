const chai = require('chai');
const {describe, it} = require('mocha');
const Helper = require('../Helper');
const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.statics', function () {

  describe('empty()', function () {
    it('should create optional with null value', function (done) {
      Helper.assertAsyncValue(AsyncOptional.empty(), null, done);
    });
  });

  describe('with()', function () {
    it('should create an optional with sync null value', function (done) {
      // noinspection JSAccessibilityCheck
      AsyncOptional.with(null).asyncValue
        .then(value => {
          chai.assert.isNull(value);
          done();
        })
        .catch(done);
    });

    it('should create an with sync undefined value', function (done) {
      // noinspection JSAccessibilityCheck
      AsyncOptional.with(undefined).asyncValue
        .then(value => {
          chai.assert.isUndefined(value);
          done();
        })
        .catch(done);
    });

    it('should create an optional with async null value', function (done) {
      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve(null)).asyncValue
        .then(value => {
          chai.assert.isNull(value);
          done();
        })
        .catch(done);
    });

    it('should create an optional with async undefined value', function (done) {
      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve()).asyncValue
        .then(value => {
          chai.assert.isUndefined(value);
          done();
        })
        .catch(done);
    });

    it('should create an optional with sync defined value', function (done) {
      // noinspection JSAccessibilityCheck
      AsyncOptional.with(DEFINED_VALUE).asyncValue
        .then(value => {
          chai.assert.equal(value, DEFINED_VALUE);
          done();
        })
        .catch(done);
    });

    it('should create an optional with async defined value', function (done) {
      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE)).asyncValue
        .then(value => {
          chai.assert.equal(value, DEFINED_VALUE);
          done();
        })
        .catch(done);
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
      Helper.assertAsyncValue(
        AsyncOptional.withEnsured(DEFINED_VALUE), DEFINED_VALUE, done);
    });

    it('should create an optional with async defined value', function (done) {
      Helper.assertAsyncValue(
        AsyncOptional.withEnsured(Promise.resolve(DEFINED_VALUE)), DEFINED_VALUE, done);
    });
  });
});