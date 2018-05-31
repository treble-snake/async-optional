const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.filter()', function () {

  describe('empty cases', function () {
    it('should not be called on empty optional', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.empty()
        .filter(n => {
          called = true;
          return n > DEFINED_VALUE;
        })
        .asyncValue
        .then(value => {
          chai.assert.isFalse(called);
          chai.assert.isNull(value);
          done();
        })
        .catch(done);
    });
  });

  describe('filtering cases', function () {
    it('should filter off a value with sync defined value and sync predicate', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(DEFINED_VALUE)
        .filter(n => {
          called = true;
          return n > DEFINED_VALUE;
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.isNull(value);
          done();
        })
        .catch(done);
    });

    it('should filter off a value with sync defined value and async predicate', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(DEFINED_VALUE)
        .filter(n => {
          called = true;
          return Promise.resolve(n > DEFINED_VALUE);
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.isNull(value);
          done();
        })
        .catch(done);
    });

    it('should filter off a value with async defined value and sync predicate', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .filter(n => {
          called = true;
          return n > DEFINED_VALUE;
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.isNull(value);
          done();
        })
        .catch(done);
    });

    it('should filter off a value with async defined value and async predicate', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .filter(n => {
          called = true;
          return Promise.resolve(n > DEFINED_VALUE);
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.isNull(value);
          done();
        })
        .catch(done);
    });
  });

  describe('not filtering cases', function () {
    it('should not filter off a value with sync defined value and sync predicate', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(DEFINED_VALUE)
        .filter(n => {
          called = true;
          return n === DEFINED_VALUE;
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.strictEqual(value, DEFINED_VALUE);
          done();
        })
        .catch(done);
    });

    it('should not filter off a value with sync defined value and async predicate', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(DEFINED_VALUE)
        .filter(n => {
          called = true;
          return Promise.resolve(n === DEFINED_VALUE);
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.strictEqual(value, DEFINED_VALUE);
          done();
        })
        .catch(done);
    });

    it('should not filter off a value with async defined value and sync predicate', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .filter(n => {
          called = true;
          return n === DEFINED_VALUE;
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.strictEqual(value, DEFINED_VALUE);
          done();
        })
        .catch(done);
    });

    it('should not filter off a value with async defined value and async predicate', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .filter(n => {
          called = true;
          return Promise.resolve(n === DEFINED_VALUE);
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.strictEqual(value, DEFINED_VALUE);
          done();
        })
        .catch(done);
    });
  });
});