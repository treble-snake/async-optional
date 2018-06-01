const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.ifPresent()', function () {

  it('should not call function on empty optional', function (done) {
    let called = false;

    AsyncOptional.empty()
      .ifPresent(() => {
        called = true;
      })
      .then(() => {
        chai.assert.isFalse(called);
        done();
      })
      .catch(done);
  });

  it('should call function on sync value', function (done) {
    let called = false;
    let value;

    AsyncOptional.with(DEFINED_VALUE)
      .ifPresent(n => {
        called = true;
        value = n;
      })
      .then(() => {
        chai.assert.isTrue(called);
        chai.assert.strictEqual(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });

});