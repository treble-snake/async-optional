const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('AsyncOptional.orUse()', function () {

  it('should be called on empty optional', function (done) {
    // noinspection JSAccessibilityCheck
    AsyncOptional.empty()
      .orUse(ANOTHER_VALUE)
      .asyncValue
      .then(value => {
        chai.assert.strictEqual(value, ANOTHER_VALUE);
        done();
      })
      .catch(done);
  });

  it('should not be called on optional with sync defined value', function (done) {
    let called = false;

    // noinspection JSAccessibilityCheck
    AsyncOptional.with(DEFINED_VALUE)
      .orUse(ANOTHER_VALUE)
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
      .orUse(ANOTHER_VALUE)
      .asyncValue
      .then(value => {
        chai.assert.isFalse(called);
        chai.assert.strictEqual(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });

});