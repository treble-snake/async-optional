const chai = require('chai');
const {describe, it} = require('mocha');

const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('Optional.orUse()', function () {

  it('should be called on empty optional', function () {
    // noinspection JSAccessibilityCheck
    const value = Optional.empty()
      .orUse(ANOTHER_VALUE)
      .value;

    chai.assert.strictEqual(value, ANOTHER_VALUE);
  });

  it('should not be called on optional with sync defined value', function () {
    let called = false;

    // noinspection JSAccessibilityCheck
    const value = Optional.with(DEFINED_VALUE)
      .orUse(ANOTHER_VALUE)
      .value;

    chai.assert.isFalse(called);
    chai.assert.strictEqual(value, DEFINED_VALUE);
  });
});