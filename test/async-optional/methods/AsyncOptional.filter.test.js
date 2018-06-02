const chai = require('chai');
const {describe, it} = require('mocha');
const Helper = require('../../Helper');
const AsyncOptional = require('../../../src/AsyncOptional');

const DEFINED_VALUE = 42;

describe('AsyncOptional.filter()', function () {

  describe('empty cases', function () {
    it('should not be called on empty sync optional value', function () {
      let called = {value: false};

      return AsyncOptional.with(null)
        .filter(n => {
          called.value = true;
          return n > DEFINED_VALUE;
        })
        .get()
        .then(value => {
          chai.assert.isFalse(called.value);
          chai.assert.isNull(value);
        });
    });

    it('should not be called on empty async optional value', function () {
      let called = {value: false};

      return AsyncOptional.with(Promise.resolve())
        .filter(n => {
          called.value = true;
          return n > DEFINED_VALUE;
        })
        .get()
        .then(value => {
          chai.assert.isFalse(called.value);
          chai.assert.isNull(value);
        });
    });
  });

  describe('filtering cases', function () {
    it('should filter off a value with sync defined value and sync predicate', function () {
      let called = {value: false};

      return AsyncOptional.with(DEFINED_VALUE)
        .filter(n => {
          called.value = true;
          return n > DEFINED_VALUE;
        })
        .get()
        .then(value => {
          chai.assert.isTrue(called.value);
          chai.assert.isNull(value);
        });
    });

    it('should filter off a value with sync defined value and async predicate', function () {
      let called = {value: false};

      return AsyncOptional.with(DEFINED_VALUE)
        .filter(n => {
          called.value = true;
          return Promise.resolve(n > DEFINED_VALUE);
        })
        .get()
        .then(value => {
          chai.assert.isTrue(called.value);
          chai.assert.isNull(value);
        });
    });

    it('should filter off a value with async defined value and sync predicate', function () {
      let called = {value: false};

      return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .filter(n => {
          called.value = true;
          return n > DEFINED_VALUE;
        })
        .get()
        .then(value => {
          chai.assert.isTrue(called.value);
          chai.assert.isNull(value);
        });
    });

    it('should filter off a value with async defined value and async predicate', function () {
      let called = {value: false};

      return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .filter(n => {
          called.value = true;
          return Promise.resolve(n > DEFINED_VALUE);
        })
        .get()
        .then(value => {
          chai.assert.isTrue(called.value);
          chai.assert.isNull(value);
        });
    });
  });

  describe('not filtering cases', function () {
    it('should not filter off a value with sync defined value and sync predicate', function () {
      let called = {value: false};

      return AsyncOptional.with(DEFINED_VALUE)
        .filter(n => {
          called.value = true;
          return n === DEFINED_VALUE;
        })
        .get()
        .then(value => {
          chai.assert.isTrue(called.value);
          chai.assert.strictEqual(value, DEFINED_VALUE);
        });
    });

    it('should not filter off a value with sync defined value and async predicate', function () {
      let called = {value: false};

      return AsyncOptional.with(DEFINED_VALUE)
        .filter(n => {
          called.value = true;
          return Promise.resolve(n === DEFINED_VALUE);
        })
        .get()
        .then(value => {
          chai.assert.isTrue(called.value);
          chai.assert.strictEqual(value, DEFINED_VALUE);
        });
    });

    it('should not filter off a value with async defined value and sync predicate', function () {
      let called = {value: false};

      return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .filter(n => {
          called.value = true;
          return n === DEFINED_VALUE;
        })
        .get()
        .then(value => {
          chai.assert.isTrue(called.value);
          chai.assert.strictEqual(value, DEFINED_VALUE);
        });
    });

    it('should not filter off a value with async defined value and async predicate', function () {
      let called = {value: false};

      return AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
        .filter(n => {
          called.value = true;
          return Promise.resolve(n === DEFINED_VALUE);
        })
        .get()
        .then(value => {
          chai.assert.isTrue(called.value);
          chai.assert.strictEqual(value, DEFINED_VALUE);
        });
    });
  });

  describe('failing cases', function () {
    it('should throw if callback throws (sync value)', function () {
      return Helper.sync().checkFail(
        () => AsyncOptional.with(DEFINED_VALUE)
          .filter(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });

    it('should throw if callback throws (async value)', function () {
      return Helper.async().checkFail(
        AsyncOptional.with(Promise.resolve(DEFINED_VALUE))
          .filter(() => {
            throw new Error('SpecialError');
          }),
        Error, 'SpecialError');
    });
  });
});