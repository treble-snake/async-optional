const chai = require('chai');
const {describe, it} = require('mocha');
const Helper = require('../Helper');
const Optional = require('../../src/Optional');

const DEFINED_VALUE = 42;

describe('Optional.statics', function () {

  describe('empty()', function () {
    it('should create optional with null value', function () {
      Helper.checkSyncValue(Optional.empty(), null);
    });
  });

  describe('with()', function () {
    it('should create an optional with sync null value', function () {
      Helper.checkSyncValue(Optional.with(null), null);
    });

    it('should create an with sync undefined value', function () {
      Helper.checkSyncValue(Optional.with(undefined), undefined);
    });

    it('should create an optional with async null value', function () {
      Helper.checkSyncValue(Optional.with(null), null);
    });

    it('should create an optional with sync defined value', function () {
      Helper.checkSyncValue(
        Optional.with(DEFINED_VALUE), DEFINED_VALUE);
    });
  });

  describe('withEnsured()', function () {

    /**
     * @param {function} callback
     */
    function checkFail(callback) {
      chai.expect(callback).to.throw(TypeError, 'Value can\'t be empty');
    }

    it('should fail on an optional with sync null value', function () {
      checkFail(() => Optional.withEnsured(null));
    });

    it('should create an with sync undefined value', function () {
      checkFail(() => Optional.withEnsured(undefined));
    });

    it('should create an optional with sync defined value', function () {
      Helper.checkSyncValue(
        Optional.withEnsured(DEFINED_VALUE), DEFINED_VALUE);
    });

  });
});