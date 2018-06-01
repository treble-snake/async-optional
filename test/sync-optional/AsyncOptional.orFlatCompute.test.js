const chai = require('chai');
const {describe, it} = require('mocha');
const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('Optional.orFlatCompute()', function () {

  function createAnotherOptional() {
    return Optional.with(777);
  }

  it('should be called on empty optional', function () {
    let called = false;

    const value = Optional.empty()
      .orFlatCompute(() => {
        called = true;
        return createAnotherOptional();
      })
      .value;

    chai.assert.isTrue(called);
    chai.assert.strictEqual(value, ANOTHER_VALUE);
  });

  it('should not be called on optional with sync defined value', function () {
    let called = false;

    const value = Optional.with(DEFINED_VALUE)
      .orFlatCompute(() => {
        called = true;
        return createAnotherOptional();
      })
      .value;

    chai.assert.isFalse(called);
    chai.assert.strictEqual(value, DEFINED_VALUE);
  });

});