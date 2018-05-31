const chai = require('chai');
const {describe, it} = require('mocha');
const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.filter()', function () {

  it('should not be called on empty optional', function () {
    let called = false;

    const value = Optional.empty()
      .filter(n => {
        called = true;
        return n > DEFINED_VALUE;
      })
      .value;

    chai.assert.isFalse(called);
    chai.assert.isNull(value);
  });

  it('should filter off a value with sync defined value and sync predicate', function () {
    let called = false;

    const value = Optional.with(DEFINED_VALUE)
      .filter(n => {
        called = true;
        return n > DEFINED_VALUE;
      })
      .value;

    chai.assert.isTrue(called);
    chai.assert.isNull(value);
  });


  it('should not filter off a value with sync defined value and sync predicate', function () {
    let called = false;

    const value = Optional.with(DEFINED_VALUE)
      .filter(n => {
        called = true;
        return n === DEFINED_VALUE;
      })
      .value;

    chai.assert.isTrue(called);
    chai.assert.strictEqual(value, DEFINED_VALUE);
  });

});