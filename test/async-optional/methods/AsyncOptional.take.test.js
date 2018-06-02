const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.take()', function () {

  describe('with sync value', function () {

    it('should not fail on empty AsyncOptional', function () {
      return AsyncOptional.with(null)
        .take('x')
        .get()
        .then(value =>
          chai.assert.isNull(value));
    });

    it('should convert primitive to an empty AsyncOptional', function () {
      return AsyncOptional.with(1)
        .take('x')
        .get()
        .then(value =>
          chai.assert.isUndefined(value));
    });

    it('should return empty AsyncOptional if property is absent form object', function () {
      return AsyncOptional.with({b: DEFINED_VALUE})
        .take('x')
        .get()
        .then(value =>
          chai.assert.isUndefined(value));
    });

    it('should take existing property form object', function () {
      return AsyncOptional.with({x: DEFINED_VALUE})
        .take('x')
        .get()
        .then(value =>
          chai.assert.strictEqual(value, DEFINED_VALUE));
    });
  });

  describe('with async value', function () {

    it('should not fail on empty AsyncOptional', function () {
      return AsyncOptional.with(Promise.resolve())
        .take('x')
        .get()
        .then(value =>
          chai.assert.isNull(value));
    });

    it('should convert primitive to an empty AsyncOptional', function () {
      return AsyncOptional.with(Promise.resolve(1))
        .take('x')
        .get()
        .then(value =>
          chai.assert.isUndefined(value));
    });

    it('should return empty AsyncOptional if property is absent form object', function () {
      return AsyncOptional.with(Promise.resolve({b: DEFINED_VALUE}))
        .take('x')
        .get()
        .then(value =>
          chai.assert.isUndefined(value));
    });

    it('should take existing property form object', function () {
      return AsyncOptional.with(Promise.resolve({x: DEFINED_VALUE}))
        .take('x')
        .get()
        .then(value =>
          chai.assert.strictEqual(value, DEFINED_VALUE));
    });
  });
});