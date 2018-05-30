const {describe, it} = require('mocha');
const AsyncOptional = require('../../src/AsyncOptional');
const Helper = require('../Helper');

const DEFINED_VALUE = 42;

describe('AsyncOptional.flatMap()', function () {

  it('should return true on optional with sync defined value', function (done) {
    Helper.assertAsyncValue(
      AsyncOptional.with(DEFINED_VALUE)
        .flatMap(x => AsyncOptional.with(x)), DEFINED_VALUE, done
    );
    // AsyncOptional.with(DEFINED_VALUE)
    //   .flatMap(x => {
    //     return AsyncOptional.with(x);
    //   })
    //   .asyncValue
    //   .then(value => {
    //     chai.assert.equal(value, DEFINED_VALUE);
    //     done();
    //   })
    //   .catch(done);
  });

});