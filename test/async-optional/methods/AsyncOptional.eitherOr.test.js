const chai = require('chai');
const {describe, it} = require('mocha');
const Helper = require('../../Helper');
const AsyncOptional = require('../../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.eitherOr()', function () {

  describe('with synk value', function () {
    it('should not call function on sync valued empty optional (1 argument)', function () {
      let called = {value: false};
      let result;

      return AsyncOptional.with(null)
        .eitherOr(n => {
          called.value = true;
          result = n;
        })
        .then(() => {
          chai.assert.isFalse(called.value);
          chai.assert.isUndefined(result);
        });
    });

    it('should call function on sync value (1 argument)', function () {
      let called = {value: false};
      let result;

      return AsyncOptional.with(DEFINED_VALUE)
        .eitherOr(n => {
          called.value = true;
          result = n;
        })
        .then(() => {
          chai.assert.isTrue(called.value);
          chai.assert.strictEqual(result, DEFINED_VALUE);
        });
    });

    it('should call onyl 2nd callback on empty optional (2 arguments)', function () {
      let onPresenceCalled = false;
      let onAbsenceCalled = false;
      let value;

      AsyncOptional.empty()
        .eitherOr(n => {
          onPresenceCalled = true;
          value = n;
        }, () => {
          onAbsenceCalled = true;
        })
        .then(() => {
          chai.assert.isFalse(onPresenceCalled);
          chai.assert.isTrue(onAbsenceCalled);
          chai.assert.isUndefined(value);
        });
    });

    it('should call only 1st callback on defined value (2 arguments)', function () {
      let onPresenceCalled = false;
      let onAbsenceCalled = false;
      let value;

      return AsyncOptional.with(DEFINED_VALUE)
        .eitherOr(n => {
          onPresenceCalled = true;
          value = n;
        }, () => {
          onAbsenceCalled = true;
        })
        .then(() => {
          chai.assert.isTrue(onPresenceCalled);
          chai.assert.isFalse(onAbsenceCalled);
          chai.assert.strictEqual(value, DEFINED_VALUE);
        });
    });

    it('should throw if on present action throws', function () {
      Helper.sync().checkFail(
        () => AsyncOptional.with(DEFINED_VALUE)
          .eitherOr(() => {
            throw new Error('SpecialError');
          }, () => {
          }),
        Error, 'SpecialError');
    });

    it('should throw if on absence action throws', function () {
      Helper.sync().checkFail(
        () => AsyncOptional.with(null)
          .eitherOr(() => {
            throw new Error('SpecialError');
          }, () => {
            throw new Error('ErrorOnAbsence');
          }),
        Error, 'ErrorOnAbsence');
    });
  });

  describe('with asynk value', function () {
    it('should not call function on async valued empty optional (1 argument)', function () {
      let called = {value: false};
      let result;

      return AsyncOptional.with(Promise.resolve())
        .eitherOr(n => {
          called.value = true;
          result = n;
        })
        .then(() => {
          chai.assert.isFalse(called.value);
          chai.assert.isUndefined(result);
        });
    });

    it('should call function on async value (1 argument)', function () {
      let called = {value: false};
      let result;

      return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .eitherOr(n => {
          called.value = true;
          result = n;
        })
        .then(() => {
          chai.assert.isTrue(called.value);
          chai.assert.strictEqual(result, DEFINED_VALUE);
        });
    });

    it('should call onyl 2nd callback on empty optional (2 arguments)', function () {
      let onPresenceCalled = false;
      let onAbsenceCalled = false;
      let value;

      AsyncOptional.with(Promise.resolve())
        .eitherOr(n => {
          onPresenceCalled = true;
          value = n;
        }, () => {
          onAbsenceCalled = true;
        })
        .then(() => {
          chai.assert.isFalse(onPresenceCalled);
          chai.assert.isTrue(onAbsenceCalled);
          chai.assert.isUndefined(value);
        });
    });

    it('should call only 1st callback on defined value (2 arguments)', function () {
      let onPresenceCalled = false;
      let onAbsenceCalled = false;
      let value;

      return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .eitherOr(n => {
          onPresenceCalled = true;
          value = n;
        }, () => {
          onAbsenceCalled = true;
        })
        .then(() => {
          chai.assert.isTrue(onPresenceCalled);
          chai.assert.isFalse(onAbsenceCalled);
          chai.assert.strictEqual(value, DEFINED_VALUE);
        });
    });


    it('should throw if on present action throws', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
          .eitherOr(() => {
            throw new Error('SpecialError');
          }, () => {
          }),
        Error, 'SpecialError');
    });

    it('should throw if on absence action throws', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve())
          .eitherOr(() => {
            throw new Error('SpecialError');
          }, () => {
            throw new Error('ErrorOnAbsence');
          }),
        Error, 'ErrorOnAbsence');
    });
  });


});