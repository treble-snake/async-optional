const chai = require('chai');
const {describe, it} = require('mocha');
const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.isEmpty()', function () {

  function check(optional, value) {
    chai.assert.strictEqual(optional.isEmpty(), value);
  }

  it('should return true on empty optional', function () {
    check(Optional.empty(), true);
  });

  it('should return true on optional with sync null value', function () {
    check(Optional.with(null), true);
  });

  it('should return true on optional with sync undefined value', function () {
    check(Optional.with(undefined), true);
  });

  it('should return false on optional with sync defined value', function () {
    check(Optional.with(DEFINED_VALUE), false);
  });
});