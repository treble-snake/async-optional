const chai = require('chai');
const {describe, it} = require('mocha');
const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;
const DEFAULT_VALUE = 8;

describe('Optional.getOrDefault()', function () {

  function check(optional, value) {
    chai.assert.strictEqual(optional.getOrDefault(DEFAULT_VALUE), value);
  }

  it('should return default value on empty optional', function () {
    check(Optional.empty(), DEFAULT_VALUE);
  });

  it('should return default value on optional with sync null value', function () {
    check(Optional.with(null), DEFAULT_VALUE);
  });

  it('should return default value on optional with sync undefined value', function () {
    check(Optional.with(undefined), DEFAULT_VALUE);
  });

  it('should return defined value on optional with sync defined value', function () {
    check(Optional.with(DEFINED_VALUE), DEFINED_VALUE);
  });
});