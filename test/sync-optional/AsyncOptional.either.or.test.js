const chai = require('chai');
const {describe, it} = require('mocha');

const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.eitherOr()', function () {

  describe('just either()', function () {

    it('should return `or` interface', function () {
      const result = Optional.empty()
        .either(n => {
        });
      chai.assert.isFunction(result.or);
    });
  });

  it('should call onyl 2nd callback on empty optional (2 arguments)', function () {
    let onPresenceCalled = false;
    let onAbsenceCalled = false;
    let value;

    Optional.empty()
      .either(n => {
        onPresenceCalled = true;
        value = n;
      })
      .or(() => {
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
      .either(n => {
        onPresenceCalled = true;
        value = n;
      })
      .or(() => {
        onAbsenceCalled = true;
      });

    chai.assert.isTrue(onPresenceCalled);
    chai.assert.isFalse(onAbsenceCalled);
    chai.assert.strictEqual(value, DEFINED_VALUE);
  });
});