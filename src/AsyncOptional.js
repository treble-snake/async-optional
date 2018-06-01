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
   * final methods (like {@link eitherOr}, {@link get}, etc)
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
  orFlatCompute(optionalSupplier) {
    return new AsyncOptional(new Promise((resolve, reject) => {
      this.asyncValue
        .then(value => isEmpty(value) ? optionalSupplier().get() : value)
        .then(value => resolve(value))
        .catch(reject);
    }));
  }

  /**
   * Creates a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with given value
   *
   * @param {M} newValue
   * @return {AsyncOptional<T|M>}
   * @template T
   * @template M
   */
  orUse(newValue) {
    return new AsyncOptional(new Promise((resolve, reject) => {
      this.asyncValue
        .then(value => resolve(isEmpty(value) ? newValue : value))
        .catch(reject);
    }));
  }

  /**
   * Creates a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with value returned by given supplier
   *
   * @param {function(): Promise<M>|function(): M} supplier
   * @return {AsyncOptional<T|M>}
   * @template T
   * @template M
   */
  orCompute(supplier) {
    return new AsyncOptional(new Promise((resolve, reject) => {
      this.asyncValue
        .then(value => isEmpty(value) ? supplier() : value)
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
   * Provides action to perform if optional value is defined
   *
   * @param {function(T): void|function(T): Promise<void>} action
   * @return {Promise<void>}
   * @template T
   */
  ifPresent(action) {
    return this.asyncValue.then(value => {
      if (!isEmpty(value)) {
        return action(value);
      }
    });
  }

  /**
   * Provides action to perform if optional value is defined,
   * should be followed by chained method `.or()` with action
   * to perform if optional value if empty
   *
   * @param {function(T): Promise|function(T): void} actionOnPresence
   * @return {{or: (function(function(): *): Promise<void>)}}
   * @template T
   */
  either(actionOnPresence) {
    const actionPromise = this.ifPresent(actionOnPresence);
    return {
      or: actionOnAbsence =>
        actionPromise.then(() => this.ifEmpty(actionOnAbsence))
    };
  }


  /**
   * Provides actions to perform with optional value on presence and absence
   *
   * @param {function(T): void|function(T): Promise<void>} actionOnPresence
   * - executed only with non-empty values
   * @param {function(): void|function(): Promise<void>} [actionOnAbsence]
   * - executed only if value is empty, can be omitted
   * @return {Promise<void>}
   */
  eitherOr(actionOnPresence, actionOnAbsence) {
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
   * @param {function(): void|function(): Promise<void>} action
   * @return {Promise<void>}
   */
  ifEmpty(action) {
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
          return Promise.resolve(mapper(value))
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
}

module.exports = AsyncOptional;