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


}

module.exports = Helper;