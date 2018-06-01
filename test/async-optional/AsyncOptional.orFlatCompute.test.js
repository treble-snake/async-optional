const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('AsyncOptional.orFlatCompute()', function () {

  function createAnotherOptional() {
    return AsyncOptional.with(777);
  }

  it('should be called on empty optional', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.empty()
      .orFlatCompute(() => {
        called = true;
        return createAnotherOptional();
      })
      .asyncValue
      .then(value => {
        chai.assert.isTrue(called);
        chai.assert.strictEqual(value, ANOTHER_VALUE);
        done();
      })
      .catch(done);
  });

  it('should not be called on optional with sync defined value', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.with(DEFINED_VALUE)
      .orFlatCompute(() => {
        called = true;
        return createAnotherOptional();
      })
      .asyncValue
      .then(value => {
        chai.assert.isFalse(called);
        chai.assert.strictEqual(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });

  it('should not be called on optional with async defined value', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
      .orFlatCompute(() => {
        called = true;
        return createAnotherOptional();
      })
      .asyncValue
      .then(value => {
        chai.assert.isFalse(called);
        chai.assert.strictEqual(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });

  it('should throw if supplier does not return AsyncOptional', function (done) {
    // noinspection JSAccessibilityCheck
    AsyncOptional.empty()
      .orFlatCompute(() => {
        return ANOTHER_VALUE;
      })
      .asyncValue
      .catch(e => {
        chai.assert.instanceOf(e, TypeError);
        done();
      });
  });
});