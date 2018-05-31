const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.map()', function () {

  describe('empty cases', function () {
    it('should not be called on empty optional', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.empty()
        .map(n => {
          called = true;
          return n + 1;
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

  describe('non empty cases', function () {
    it('should map a value with sync defined value and sync mapper', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(DEFINED_VALUE)
        .map(n => {
          called = true;
          return n + 1;
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.equal(value, DEFINED_VALUE + 1);
          done();
        })
        .catch(done);
    });

    it('should map a value with sync defined value and async mapper', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(DEFINED_VALUE)
        .map(n => {
          called = true;
          return Promise.resolve(n + 1);
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.equal(value, DEFINED_VALUE + 1);
          done();
        })
        .catch(done);
    });

    it('should map a value with async defined value and sync mapper', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .map(n => {
          called = true;
          return n + 1;
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.equal(value, DEFINED_VALUE + 1);
          done();
        })
        .catch(done);
    });

    it('should map a value with async defined value and async mapper', function (done) {
      let called = false;

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .map(n => {
          called = true;
          return Promise.resolve(n + 1);
        })
        .asyncValue
        .then(value => {
          chai.assert.isTrue(called);
          chai.assert.equal(value, DEFINED_VALUE + 1);
          done();
        })
        .catch(done);
    });

    it('should map a value with several mappers', function (done) {
      let called = 0;

      const syncMapper = n => {
        called++;
        return n + 1;
      };
      const asyncMapper = n => {
        called++;
        return Promise.resolve(n + 1);
      };

      // noinspection JSAccessibilityCheck
      AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .map(syncMapper)
        .map(asyncMapper)
        .map(syncMapper)
        .map(asyncMapper)
        .asyncValue
        .then(value => {
          chai.assert.equal(called, 4);
          chai.assert.equal(value, DEFINED_VALUE + 4);
          done();
        })
        .catch(done);
    });
  });
});