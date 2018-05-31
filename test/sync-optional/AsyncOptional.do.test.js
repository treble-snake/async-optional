const chai = require('chai');
const {describe, it} = require('mocha');
const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.do()', function () {

  it('should not call function on empty optional (1 argument)', function () {
    let called = false;
    let result;

    Optional.empty()
      .do(n => {
        called = true;
        result = n;
      });

    chai.assert.isFalse(called);
    chai.assert.isUndefined(result);
  });

  it('should call function on sync value (1 argument)', function () {
    let called = false;
    let result;

    Optional.with(DEFINED_VALUE)
      .do(n => {
        called = true;
        result = n;
      });
    chai.assert.isTrue(called);
    chai.assert.strictEqual(result, DEFINED_VALUE);
  });

  it('should call onyl 2nd callback on empty optional (2 arguments)', function () {
    let onPresenceCalled = false;
    let onAbsenceCalled = false;
    let value;

    Optional.empty()
      .do(n => {
        onPresenceCalled = true;
        value = n;
      }, () => {
        onAbsenceCalled = true;
      });

    chai.assert.isFalse(onPresenceCalled);
    chai.assert.isTrue(onAbsenceCalled);
    chai.assert.isUndefined(value);
  });

  it('should call only 1st callback on defined value (2 arguments)', function () {
    let onPresenceCalled = false;
    let onAbsenceCalled = false;
    let value;

    Optional.with(DEFINED_VALUE)
      .do(n => {
        onPresenceCalled = true;
        value = n;
      }, () => {
        onAbsenceCalled = true;
      });

    chai.assert.isTrue(onPresenceCalled);
    chai.assert.isFalse(onAbsenceCalled);
    chai.assert.strictEqual(value, DEFINED_VALUE);
  });
});