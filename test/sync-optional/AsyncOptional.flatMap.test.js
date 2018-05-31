const chai = require('chai');
const {describe, it} = require('mocha');
const Optional = require('../../src/Optional');
const Helper = require('../Helper');

const DEFINED_VALUE = 42;

describe('Optional.flatMap()', function () {

  function flatMapper(x) {
    return Optional.with(x + 1);
  }

  it('should not be called on empty optional', function () {
    let called = false;

    const value = Optional.empty()
      .flatMap(n => {
        called = true;
        return flatMapper(n);
      })
      .value;

    chai.assert.isFalse(called);
    chai.assert.isNull(value);
  });

  it('should throw on wrong mapper function result', function (done) {
    let called = false;

    try {
      Optional.with(DEFINED_VALUE)
        .flatMap(n => {
          called = true;
          return n;
        });
    } catch (e) {
      chai.assert.isTrue(called);
      chai.assert.instanceOf(e, TypeError);
      chai.assert.strictEqual(e.message, 'Flat mapper did not return an Optional');
      done();
    }

  });

  it('should map data on optional with sync defined value and sync mapper', function () {
    Helper.checkSyncValue(
      Optional.with(DEFINED_VALUE).flatMap(flatMapper),
      DEFINED_VALUE + 1);
  });
});