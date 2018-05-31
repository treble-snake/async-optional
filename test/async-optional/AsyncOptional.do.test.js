const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.do()', function () {

  it('should not call function on empty optional (1 argument)', function (done) {
    let called = false;
    let result;

    AsyncOptional.empty()
      .do(n => {
        called = true;
        result = n;
      })
      .then(() => {
        chai.assert.isFalse(called);
        chai.assert.isUndefined(result);
        done();
      })
      .catch(done);
  });

  it('should call function on sync value (1 argument)', function (done) {
    let called = false;
    let result;

    AsyncOptional.with(DEFINED_VALUE)
      .do(n => {
        called = true;
        result = n;
      })
      .then(() => {
        chai.assert.isTrue(called);
        chai.assert.equal(result, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });

  it('should call function on async value (1 argument)', function (done) {
    let called = false;
    let result;

    AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
      .do(n => {
        called = true;
        result = n;
      })
      .then(() => {
        chai.assert.isTrue(called);
        chai.assert.equal(result, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });

  it('should call onyl 2nd callback on empty optional (2 arguments)', function (done) {
    let onPresenceCalled = false;
    let onAbsenceCalled = false;
    let value;

    AsyncOptional.empty()
      .do(n => {
        onPresenceCalled = true;
        value = n;
      }, () => {
        onAbsenceCalled = true;
      })
      .then(() => {
        chai.assert.isFalse(onPresenceCalled);
        chai.assert.isTrue(onAbsenceCalled);
        chai.assert.isUndefined(value);
        done();
      })
      .catch(done);
  });

  it('should call only 1st callback on defined value (2 arguments)', function (done) {
    let onPresenceCalled = false;
    let onAbsenceCalled = false;
    let value;

    AsyncOptional.with(DEFINED_VALUE)
      .do(n => {
        onPresenceCalled = true;
        value = n;
      }, () => {
        onAbsenceCalled = true;
      })
      .then(() => {
        chai.assert.isTrue(onPresenceCalled);
        chai.assert.isFalse(onAbsenceCalled);
        chai.assert.equal(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });
});