const chai = require('chai');
const {describe, it} = require('mocha');

const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.map()', function () {

  describe('empty cases', function () {
    it('should not be called on empty optional', function () {
      let called = false;

      const value = Optional.empty()
        .map(n => {
          called = true;
          return n + 1;
        })
        .value;

      chai.assert.isFalse(called);
      chai.assert.isNull(value);
    });
  });

  describe('non empty cases', function () {
    it('should map a value with sync defined value and sync mapper', function () {
      let called = false;

      const value = Optional.with(DEFINED_VALUE)
        .map(n => {
          called = true;
          return n + 1;
        })
        .value;

      chai.assert.isTrue(called);
      chai.assert.strictEqual(value, DEFINED_VALUE + 1);
    });

    it('should map a value with several mappers', function () {
      let called = 0;

      const syncMapper = n => {
        called++;
        return n + 1;
      };

      const value = Optional.with(DEFINED_VALUE)
        .map(syncMapper)
        .map(syncMapper)
        .value;

      chai.assert.strictEqual(called, 2);
      chai.assert.strictEqual(value, DEFINED_VALUE + 2);
    });
  });
});