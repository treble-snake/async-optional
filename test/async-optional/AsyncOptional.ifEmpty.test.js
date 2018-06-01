const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.ifEmpty()', function () {

  it('should call function on empty optional', function (done) {
    let called = false;

    AsyncOptional.empty()
      .ifEmpty(() => {
        called = true;
      })
      .then(() => {
        chai.assert.isTrue(called);
        done();
      })
      .catch(done);
  });

  it('should not call function on sync value', function (done) {
    let called = false;

    AsyncOptional.with(DEFINED_VALUE)
      .ifEmpty(() => {
        called = true;
      })
      .then(() => {
        chai.assert.isFalse(called);
        done();
      })
      .catch(done);
  });

});