const chai = require('chai');
const {describe, it} = require('mocha');
const AsyncOptional = require('../../../src/AsyncOptional');
const Helper = require('../../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.eitherOr()', function () {

  describe('with sync value', function () {

    it('should return `or` interface', function () {
      const result = AsyncOptional.empty()
        .either(() => {
        });
      chai.assert.isFunction(result.or);
    });

    it('should call only 2nd callback on sync valued empty optional (2 arguments)', function () {
      let onPresenceCalled = false;
      let onAbsenceCalled = false;
      let value;

      return AsyncOptional.with(null)
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
        });
    });

    it('should call only 1st callback on  sync defined value (2 arguments)', function () {
      let onPresenceCalled = false;
      let onAbsenceCalled = false;
      let value;

      return AsyncOptional.with(DEFINED_VALUE)
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
        });
    });

    it('should throw if on present action throws', function () {
      Helper.sync().checkFail(
        () => AsyncOptional.with(DEFINED_VALUE)
          .either(() => {
            throw new Error('SpecialError');
          })
          .or(() => {
          }),
        Error, 'SpecialError');
    });

    it('should throw if on absence action throws', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(null)
          .either(() => {
            throw new Error('SpecialError');
          })
          .or(() => {
            throw new Error('ErrorOnAbsence');
          }),
        Error, 'ErrorOnAbsence');
    });
  });

  describe('with async value', function () {
    it('should return `or` interface', function () {
      const result = AsyncOptional.with(Promise.resolve())
        .either(() => {
        });
      chai.assert.isFunction(result.or);
    });

    it('should call only 2nd callback on async valued empty optional (2 arguments)', function () {
      let onPresenceCalled = false;
      let onAbsenceCalled = false;
      let value;

      return AsyncOptional.with(Promise.resolve())
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
        });
    });


    it('should call only 1st callback on async defined value (2 arguments)', function () {
      let onPresenceCalled = false;
      let onAbsenceCalled = false;
      let value;

      return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
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
        });
    });

    it('should throw if on present action throws', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
          .either(() => {
            throw new Error('SpecialError');
          })
          .or(() => {
          }),
        Error, 'SpecialError');
    });

    it('should throw if on absence action throws', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve())
          .either(() => {
            throw new Error('SpecialError');
          })
          .or(() => {
            throw new Error('ErrorOnAbsence');
          }),
        Error, 'ErrorOnAbsence');
    });
  });
});