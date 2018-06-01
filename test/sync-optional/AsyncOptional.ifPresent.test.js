const chai = require('chai');
const {describe, it} = require('mocha');
const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.ifPresent()', function () {

  it('should call function on empty optional', function () {
    let called = false;

    Optional.empty()
      .ifPresent(() => {
        called = true;
      });

    chai.assert.isFalse(called);
  });

  it('should not call function on sync value', function () {
    let called = false;

    Optional.with(DEFINED_VALUE)
      .ifPresent(() => {
        called = true;
      });

    chai.assert.isTrue(called);
  });

});