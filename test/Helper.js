const chai = require('chai');

class Helper {

  /**
   * @param {AsyncOptional} optional
   * @param {*} value
   * @param {function} done
   */
  static assertAsyncValue(optional, value, done) {
    // noinspection JSAccessibilityCheck
    optional.asyncValue
      .then(value => {
        chai.assert.equal(value, value);
        done();
      })
      .catch(done);
  }
}

module.exports = Helper;