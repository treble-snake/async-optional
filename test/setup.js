// globals can be defined here
module.exports = {

  /**
   * @param {AsyncOptional} optional
   * @param {*} value
   * @param {function} done
   */
  assertAsyncValue: (optional, value, done) => {
    // noinspection JSAccessibilityCheck
    optional.asyncValue
      .then(value => {
        chai.assert.equal(value, value);
        done();
      })
      .catch(done);
  }
};