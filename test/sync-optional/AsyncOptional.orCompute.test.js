const chai = require('chai');
const {describe, it} = require('mocha');

const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('Optional.orCompute()', function () {

  it('should call sync supplier on empty optional', function () {
    let called = false;

    // noinspection JSAccessibilityCheck
    const value = Optional.empty()
      .orCompute(() => {
        called = true;
        return ANOTHER_VALUE;
      })
      .value;

    chai.assert.isTrue(called);
    chai.assert.strictEqual(value, ANOTHER_VALUE);
  });

  it('should throw if supplier does not a function', function () {
    chai.expect(() =>
      Optional.empty().orCompute(ANOTHER_VALUE))
      .to.throw(TypeError);
  });

  it('should not be called on optional with sync defined value', function () {
    let called = false;

    // noinspection JSAccessibilityCheck
    const value = Optional.with(DEFINED_VALUE)
      .orCompute(() => {
        called = true;
        return ANOTHER_VALUE;
      })
      .value;

    chai.assert.isFalse(called);
    chai.assert.strictEqual(value, DEFINED_VALUE);
  });

});