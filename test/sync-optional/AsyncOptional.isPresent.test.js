const chai = require('chai');
const {describe, it} = require('mocha');
const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.isPresent()', function () {

  function check(optional, value) {
    chai.assert.strictEqual(optional.isPresent(), value);
  }

  it('should return false on empty optional', function () {
    check(Optional.empty(), false);
  });

  it('should return false on optional with sync null value', function () {
    check(Optional.with(null), false);
  });

  it('should return false on optional with sync undefined value', function () {
    check(Optional.with(undefined), false);
  });

  it('should return true on optional with sync defined value', function () {
    check(Optional.with(DEFINED_VALUE), true);
  });
});