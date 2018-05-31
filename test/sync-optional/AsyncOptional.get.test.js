const chai = require('chai');
const {describe, it} = require('mocha');
const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.get()', function () {

  function check(optional, value) {
    chai.assert.strictEqual(optional.get(), value);
  }

  it('should return null on empty optional', function () {
    check(Optional.empty(), null);
  });

  it('should return null on optional with sync null value', function () {
    check(Optional.with(null), null);
  });

  it('should return undefined on optional with sync undefined value', function () {
    check(Optional.with(undefined), undefined);
  });

  it('should return true on optional with sync defined value', function () {
    check(Optional.with(DEFINED_VALUE), DEFINED_VALUE);
  });
});