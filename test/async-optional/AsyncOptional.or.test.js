const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('AsyncOptional.or()', function () {

  function createAnotherOptional() {
    return AsyncOptional.with(777);
  }

  it('should be called on empty optional', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.empty()
      .or(() => {
        called = true;
        return createAnotherOptional();
      })
      .asyncValue
      .then(value => {
        chai.assert.isTrue(called);
        chai.assert.equal(value, ANOTHER_VALUE);
        done();
      })
      .catch(done);
  });

  it('should not be called on optional with sync defined value', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.with(DEFINED_VALUE)
      .or(() => {
        called = true;
        return createAnotherOptional();
      })
      .asyncValue
      .then(value => {
        chai.assert.isFalse(called);
        chai.assert.equal(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });

  it('should not be called on optional with async defined value', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
      .or(() => {
        called = true;
        return createAnotherOptional();
      })
      .asyncValue
      .then(value => {
        chai.assert.isFalse(called);
        chai.assert.equal(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });
});