const {describe, it} = require('mocha');
const AsyncOptional = require('../../../src/AsyncOptional');
const Helper = require('../../Helper');

const DEFINED_VALUE = 42;
const ANOTHER_VALUE = 777;

describe('AsyncOptional.orUse()', function () {

  it('should use supplied value on empty optional', function () {
    return Helper.async().check(
      AsyncOptional.empty().orUse(ANOTHER_VALUE), ANOTHER_VALUE);
  });

  it('should use supplied value on optional with sync empty value', function () {
    return Helper.async().check(
      AsyncOptional.with(null).orUse(ANOTHER_VALUE), ANOTHER_VALUE);
  });

  it('should use supplied value on optional with async empty value', function () {
    return Helper.async().check(
      AsyncOptional.with(Promise.resolve()).orUse(ANOTHER_VALUE), ANOTHER_VALUE
    );
  });

  it('should use async supplied value on optional with sync empty value', function () {
    return Helper.async().check(
      AsyncOptional.with(null).orUse(Promise.resolve(ANOTHER_VALUE)), ANOTHER_VALUE);
  });

  it('should use async supplied value on optional with async empty value', function () {
    return Helper.async().check(
      AsyncOptional.with(Promise.resolve()).orUse(Promise.resolve(ANOTHER_VALUE)), ANOTHER_VALUE
    );
  });

  it('should not use supplied value on optional with sync defined value', function () {
    return Helper.async().check(
      AsyncOptional.with(DEFINED_VALUE).orUse(ANOTHER_VALUE), DEFINED_VALUE);
  });

  it('should not use supplied value on optional with async defined value', function () {
    return Helper.async().check(
      AsyncOptional
        .with(Promise.resolve(DEFINED_VALUE))
        .orUse(ANOTHER_VALUE),
      DEFINED_VALUE);
  });

});