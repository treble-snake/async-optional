const chai = require('chai');
const {describe, it} = require('mocha');

const Optional = require('../../../src/Optional');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('Optional.orUse()', function () {

  it('should be called on empty optional', function () {
    const value = Optional.empty()
      .orUse(ANOTHER_VALUE)
      .get();

    chai.assert.strictEqual(value, ANOTHER_VALUE);
  });

  it('should not be called on optional with sync defined value', function () {
    let called = false;

    const value = Optional.with(DEFINED_VALUE)
      .orUse(ANOTHER_VALUE)
      .get();

    chai.assert.isFalse(called);
    chai.assert.strictEqual(value, DEFINED_VALUE);
  });
});