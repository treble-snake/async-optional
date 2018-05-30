const isEmpty = require('./util').isEmpty;

/**
 * @param {*} value
 * @return {Promise}
 * @private
 */
function ensurePromise(value) {
  return value instanceof Promise ? value : Promise.resolve(value);
}

/**
 * AsyncOptional<T>
 * @class
 * @template T
 */
class AsyncOptional {

  /**
   * @param {Promise|*} value value to contain, gets cast to Promise
   */
  constructor(value) {
    /**
     * @private
     * @type {Promise<T>}
     */
    this.asyncValue = ensurePromise(value);
  }

  /**
   * Creates an AsyncOptional with empty (null) value
   * @return {AsyncOptional<null>}
   */
  static empty() {
    return new AsyncOptional(null);
  }

  /**
   * Creates an optional with specified nullable value (which can be a promise)
   * @param {Promise<T>|T} value
   * @return {AsyncOptional<T>}
   * @template T
   */
  static with(value) {
    return new AsyncOptional(value);
  }

  /**
   * Creates an optional with specified not nullable value
   * If value (or result of promise) is empty (null or undefined),
   * {@link TypeError} exception will be thrown on attempt of getting result by calling one of
   * final methods (like {@link do}, {@link get}, etc)
   *
   * @param {!Promise<T>|T} value
   * @return {AsyncOptional<T>}
   * @template T
   */
  static withEnsured(value) {
    return new AsyncOptional(new Promise((resolve, reject) => {
      ensurePromise(value)
        .then(ensuredValue => {
          if (isEmpty(ensuredValue)) {
            throw new TypeError('Value can\'t be empty');
          }

          resolve(ensuredValue);
        })
        .catch(reject);
    }));
  }

  /**
   * Creates a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with value of optional, returned by given supplier
   *
   * @param {function(): AsyncOptional<M>} optionalSupplier
   * @return {AsyncOptional<T|M>}
   * @template T
   * @template M
   */
  or(optionalSupplier) {
    return new AsyncOptional(new Promise((resolve, reject) => {
      this.asyncValue
        .then(value => isEmpty(value) ? optionalSupplier().get() : value)
        .then(value => resolve(value))
        .catch(reject);
    }));
  }


  /**
   * Checks if optional value is not empty
   * @return {Promise<boolean>} promise resulting to true if value is not empty, to false otherwise
   */
  isPresent() {
    return this.asyncValue.then(value => !isEmpty(value));
  }

  /**
   * Checks if optional value is empty
   * @return {Promise<boolean>} promise resulting to true if value is empty, to false otherwise
   */
  isEmpty() {
    return this.asyncValue.then(value => isEmpty(value));
  }

  /**
   * Returns value of optional
   * @return {Promise<T>} promise, resulting to the value of the optional
   * @template T
   */
  get() {
    return this.asyncValue;
  }

  /**
   * Returns current optional value if it's not empty,
   * returns given `other` argument value otherwise
   *
   * @param {M} other - value to be returned if current value is emptyC
   * @return {Promise<T|M>} promise resulting to one of two values
   * @template M
   * @template T
   */
  getOrDefault(other) {
    return this.asyncValue.then(value => isEmpty(value) ? other : value);
  }

  /**
   * Returns current optional value if it's not empty,
   * returns result of execution of given `supplier` function otherwise
   *
   * @param {function(): M|function(): Promise<M>} supplier - function to be
   * executed if current optional value is empty
   *
   * @return {Promise<T|M>} promise resulting to one of two values
   * @template M
   * @template T
   */
  getOrCompute(supplier) {
    return this.asyncValue
      .then(value => isEmpty(value) ? supplier() : value);
  }

  /**
   * Provides actions to perform with optional value
   *
   * @param {function(T): void} actionOnPresence - executed only with non-empty values
   * @param {function(): void} [actionOnAbsence] - executed only if value is empty, can be omitted
   * @return {Promise<void>}
   */
  do(actionOnPresence, actionOnAbsence) {
    return this.asyncValue.then(value => {
      if (isEmpty(value)) {
        if (!isEmpty(actionOnAbsence)) {
          return actionOnAbsence();
        }
        return;
      }

      return actionOnPresence(value);
    });
  }

  /**
   * Provides action to perform if optional value is empty
   *
   * @param {function(): void} action
   * @return {Promise<void>}
   */
  doOnAbsence(action) {
    return this.asyncValue.then(value => {
      if (isEmpty(value)) {
        return action();
      }
    });

  }

  /**
   * Filters value based on given predicate function.
   * If predicate executed on current value returns false, creates empty AsyncOptional,
   * otherwise takes current value.
   * Predicate function doesn't get executed if current value is empty
   *
   * @param {function(T): boolean|function(T): Promise<boolean>} predicate
   * @return {AsyncOptional<T>} new AsyncOptional instance with current or empty value
   * @template T
   */
  filter(predicate) {
    // create new optional with a promise as a value
    return new AsyncOptional(new Promise((resolve, reject) => {
      // wait for current value
      this.asyncValue
        .then(value => {
          // if current value is empty, skip logic and set null as a new value
          if (isEmpty(value)) {
            return resolve(null);
          }

          // wait for predicate (can be async)
          Promise.resolve(predicate(value))
          // if check is passed, return current value, else it's filtered, e.g. return null
            .then(passed => resolve(passed ? value : null));
        })
        .catch(reject);
    }));
  }

  /**
   * Changes value based on given mapper function.
   * Mapper function doesn't get executed if current value is empty
   *
   * @param {function(T): M|function(T): Promise<M>} mapper
   * @return {AsyncOptional<M>} new AsyncOptional with mapped value
   * @template M
   * @template T
   */
  map(mapper) {
    // create new optional with a promise as a value
    return new AsyncOptional(new Promise((resolve, reject) => {
      // wait for current value
      this.asyncValue
        .then(value => {
          // if current value is empty, skip logic and set null as a new value
          if (isEmpty(value)) {
            return resolve(null);
          }

          // wait for mapper (can be async)
          Promise.resolve(mapper(value))
            .then(mappedValue => resolve(mappedValue));
        })
        .catch(reject);
    }));
  }

  /**
   * @param {function(T): AsyncOptional<N>|function(T): Promise<AsyncOptional<N>>} mapper
   * @return {AsyncOptional<N>}
   * @template N
   * @template T
   */
  flatMap(mapper) {
    // create new optional with a promise as a value
    return new AsyncOptional(new Promise((resolve, reject) => {
      // wait for current value
      this.asyncValue
        .then(value => {
          // if current value is empty, skip logic and set null as a new value
          if (isEmpty(value)) {
            return resolve(null);
          }

          // wait for mapper (can be async)
          Promise.resolve(mapper(value))
            .then(mappedValue => {
              if (!(mappedValue instanceof AsyncOptional)) {
                throw new TypeError('Flat mapper did not return an AsyncOptional');
              }

              // mappedValue is also an AsyncOptional, so we need to wait for its value
              return mappedValue.get()
                .then(result => resolve(result));
            });
        })
        .catch(reject);
    }));
  }

  /**
   * TODO is it needed?
   * @param {function(T): void} peeker
   * @return {AsyncOptional<T>}
   * @template T
   */
  peek(peeker) {
    return new AsyncOptional(this.asyncValue.then(value => {
      if (!isEmpty(value)) {
        peeker(value);
      }

      return value;
    }));
  }
}

module.exports = AsyncOptional;