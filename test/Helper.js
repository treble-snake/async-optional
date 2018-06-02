const chai = require('chai');

class SyncHelper {
  /**
   * @param {Optional|AsyncOptional} optional
   * @param expectedValue
   */
  static check(optional, expectedValue) {
    chai.assert.strictEqual(optional.get(), expectedValue);
  }

  static checkFail(action, ErrorClass, message) {
    chai.expect(action).to.throw(ErrorClass, message);
  }
}

class AsyncHelper {

  /**
   * @param promise
   * @param value
   * @param [called]
   * @param [calledExpected]
   * @return {Promise}
   */
  static checkPromiseResult(promise, value, called, calledExpected) {
    return promise
      .then(result => {
        chai.assert.strictEqual(result, value);
        if (called !== undefined) {
          chai.assert.strictEqual(called.value, calledExpected);
        }
      });
  }

  /**
   * @param {AsyncOptional} optional
   * @param {*} value
   * @return {Promise}
   */
  static check(optional, value) {
    return AsyncHelper.checkPromiseResult(optional.get(), value);
  }

  /**
   * @param {AsyncOptional} optional
   * @param {*} value
   * @param {{value :boolean}} called
   * @return {Promise}
   */
  static checkWithCallback(optional, value, called) {
    return AsyncHelper.checkPromiseResult(optional.get(), value, called, true);
  }

  /**
   * @param {AsyncOptional} optional
   * @param {*} value
   * @param {{value :boolean}} called
   * @return {Promise}
   */
  static checkWithoutCallback(optional, value, called) {
    return AsyncHelper.checkPromiseResult(optional.get(), value, called, false);
  }

  static checkFail(optional, ErrorClass, message) {
    const value = optional instanceof Promise ? optional : optional.get();
    return chai.expect(value)
      .to.eventually.be.rejectedWith(ErrorClass, message);
  }
}

class Helper {

  /**
   * @return {typeof SyncHelper}
   */
  static sync() {
    return SyncHelper;
  }

  /**
   * @return {typeof AsyncHelper}
   */
  static async() {
    return AsyncHelper;
  }
}

Helper.ASYNC_TYPE_ERROR_MSG = 'AsyncOptional expected';
Helper.SYNC_TYPE_ERROR_MSG = 'Optional expected';

module.exports = Helper;