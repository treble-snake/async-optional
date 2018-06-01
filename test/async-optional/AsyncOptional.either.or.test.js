const chai = require('chai');
const {describe, it} = require('mocha');

const AsyncOptional = require('../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.eitherOr()', function () {

  describe('just either()', function () {

    it('should return `or` interface', function () {
      const result = AsyncOptional.empty()
        .either(n => {
        });
      chai.assert.isFunction(result.or);
    });
  });

  it('should call onyl 2nd callback on empty optional (2 arguments)', function (done) {
    let onPresenceCalled = false;
    let onAbsenceCalled = false;
    let value;

    AsyncOptional.empty()
      .either(n => {
        onPresenceCalled = true;
        value = n;
      })
      .or(() => {
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
      .either(n => {
        onPresenceCalled = true;
        value = n;
      })
      .or(() => {
        onAbsenceCalled = true;
      })
      .then(() => {
        chai.assert.isTrue(onPresenceCalled);
        chai.assert.isFalse(onAbsenceCalled);
        chai.assert.strictEqual(value, DEFINED_VALUE);
        done();
      })
      .catch(done);
  });
});