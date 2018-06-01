const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('AsyncOptional.orCompute()', function () {

  it('should call sync supplier on empty optional', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.empty()
      .orCompute(() => {
        called = true;
        return ANOTHER_VALUE;
      })
      .asyncValue
      .then(value => {
        chai.assert.isTrue(called);
        chai.assert.strictEqual(value, ANOTHER_VALUE);
        done();
      })
      .catch(done);
  });

  it('should call async supplier on empty optional', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.empty()
      .orCompute(() => {
        called = true;
        return Promise.resolve(ANOTHER_VALUE);
      })
      .asyncValue
      .then(value => {
        chai.assert.isTrue(called);
        chai.assert.strictEqual(value, ANOTHER_VALUE);
        done();
      })
      .catch(done);
  });

  it('should throw if supplier does not a function', function (done) {
    // noinspection JSAccessibilityCheck
    AsyncOptional.empty()
      .orCompute(ANOTHER_VALUE)
      .asyncValue
      .catch(e => {
        chai.assert.instanceOf(e, TypeError);
        done();
      });
  });

  it('should not be called on optional with sync defined value', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.with(DEFINED_VALUE)
      .orCompute(() => {
        called = true;
        return ANOTHER_VALUE;
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
      .orCompute(() => {
        called = true;
        return ANOTHER_VALUE;
      })
      .asyncValue
      .then(value => {
        chai.assert.isFalse(called);
        chai.assert.strictEqual(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });

});