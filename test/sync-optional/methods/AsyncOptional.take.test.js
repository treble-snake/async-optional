const chai = require('chai');
const {describe, it} = require('mocha');

const Optional = require('../../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.take()', function () {

  it('should not fail on empty optional', function () {
    const value = Optional.empty()
      .take('x')
      .get();

    chai.assert.isNull(value);
  });

  it('should convert primitive to an empty optional', function () {
    let value = Optional.with(1)
      .take('x')
      .get();

    chai.assert.isUndefined(value);
  });

  it('should return empty optional if property is absent form object', function () {
    let value = Optional.with({b: DEFINED_VALUE})
      .take('x')
      .get();

    chai.assert.isUndefined(value);
  });

  it('should take existing property form object', function () {
    let value = Optional.with({x: DEFINED_VALUE})
      .take('x')
      .get();

    chai.assert.strictEqual(value, DEFINED_VALUE);
  });
});