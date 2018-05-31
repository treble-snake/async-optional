const chai = require('chai');

class Helper {

  static checkPromiseResult(promise, value, done) {
    promise
      .then(result => {
        chai.assert.strictEqual(result, value);
        done();
      })
      .catch(done);
  }

  /**
   * @param {AsyncOptional} optional
   * @param {*} value
   * @param {function} done
   * @return {void}
   */
  static checkAsyncValue(optional, value, done) {
    // noinspection JSAccessibilityCheck
    Helper.checkPromiseResult(optional.asyncValue, value, done);
  }

  /**
   * @param {Optional} optional
   * @param expectedValue
   */
  static checkSyncValue(optional, expectedValue) {
    // noinspection JSAccessibilityCheck
    chai.assert.strictEqual(optional.value, expectedValue);
  }
}

module.exports = Helper;