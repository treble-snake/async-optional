const isEmpty = require('./util').isEmpty;

/**
 * @param {!*} value
 * @return {boolean}
 * @private
 */
function isPromise(value) {
  return typeof value['then'] === 'function';
}

/**
 * @param {!*} value
 * @return {boolean}
 * @private
 */
function isNotPromise(value) {
  return typeof value['then'] !== 'function';
}

/**
 * @param {*} value
 * @return {Promise}
 * @private
 */
function ensurePromise(value) {
  return !isEmpty(value) && isPromise(value) ? value : Promise.resolve(value);
}

/**
 * @param {*} value
 * @return {AsyncOptional}
 * @throws {TypeError}
 * @private
 */
function assertOptional(value) {
  if (value instanceof AsyncOptional) {
    return value;
  }

  throw new TypeError('AsyncOptional expected');
}

/**
 * @param {AsyncOptional<T>} newOptional
 * @return {Promise<T>}
 * @template T
 * @private
 */
function ensureOptionalValue(newOptional) {
  return assertOptional(newOptional).get();
}

/**
 * `Optional` implementation which can contain both plain values and
 * promises resolving to a value.
 * It also can operate with both synchronous and asynchronous mappers,
 * predicates, actions and other callback functions.
 *
 * @class
 * @template T
 */
class AsyncOptional {

  /**
   * @param {Promise<T>|T} value value to contain
   */
  constructor(value) {
    /**
     * @private
     * @type {T|Promise<T>}
     */
    this.value = value;
  }

  /**
   * Creates an AsyncOptional with empty (`null`) value
   * @return {AsyncOptional<null>}
   */
  static empty() {
    return new AsyncOptional(null);
  }

  /**
   * Creates an optional with specified value (which can be a promise).
   * Value *can* be empty. Both `null` and `undefined` are considered empty.
   * @param {Promise<T>|T} value value to contain
   * @return {AsyncOptional<T>}
   * @template T
   */
  static with(value) {
    return new AsyncOptional(value);
  }

  /**
   * Creates an optional with specified value.
   * Value **can not** be empty. Both `null` and `undefined` are considered empty.
   * If the value (or result of a promise) is empty (null or undefined),
   * {@link TypeError} exception will be thrown as soon as possible -
   * e.g. for plain values it will be thrown at once, and for promises -
   * on attempt of getting result by calling one of
   * final methods (like {@link eitherOr}, {@link get}, etc).
   *
   * @param {!Promise<T>|!T} value value to contain
   * @return {AsyncOptional<T>}
   * @throws {TypeError} if given value is either `null` or `undefined`
   * @template T
   */
  static withEnsured(value) {
    if (isEmpty(value)) {
      throw new TypeError('Value can\'t be empty');
    }

    if (!isPromise(value)) {
      return new AsyncOptional(value);
    }

    return new AsyncOptional(value.then(ensuredValue => {
      if (isEmpty(ensuredValue)) {
        throw new TypeError('Value can\'t be empty');
      }

      return ensuredValue;
    }));
  }

  /**
   * @private
   * @return {boolean}
   */
  hasSyncValue() {
    return isNotPromise(this.value);
  }

  /**
   * @private
   * @return {boolean}
   */
  hasEmptyValue() {
    return isEmpty(this.value);
  }

  /**
   * Returns a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with given value
   *
   * @param {Promise<M>|M} newValue value to use if current value is empty;
   * can be a promise (resolved value will be used)
   * @return {AsyncOptional<T|M>}
   * @template T
   * @template M
   */
  orUse(newValue) {
    if (this.hasEmptyValue()) {
      return new AsyncOptional(newValue);
    }

    if (this.hasSyncValue()) {
      return new AsyncOptional(this.value);
    }

    return new AsyncOptional(this.value
      .then(value => isEmpty(value) ? newValue : value));
  }

  /**
   * Returns a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with a returned by given supplier value
   *
   * @param {function(): Promise<M>|function(): M} supplier function with no arguments which
   * provides a new value for the AsyncOptional; can return a plain value or a promise.
   *
   * Keep in mind, that if current value is plain and supplier function throws an Error,
   * it's gonna be thrown from the method immediately.
   *
   * @return {AsyncOptional<T|M>}
   * @template T
   * @template M
   */
  orCompute(supplier) {
    if (this.hasEmptyValue()) {
      return new AsyncOptional(supplier());
    }

    if (this.hasSyncValue()) {
      return new AsyncOptional(this.value);
    }

    return new AsyncOptional(this.value
      .then(value => isEmpty(value) ? supplier() : value));
  }

  /**
   * Returns a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with value of optional, returned by given supplier
   *
   * @param {function(): AsyncOptional<M>} optionalSupplier function with no arguments which
   * should return another AsyncOptional instance to use instead of current one
   * (if current one is empty); can not return Promise (which makes sense 'cause
   * it can be the value of AsyncOptional)
   *
   * Keep in mind, that if current value is plain and function throws an Error,
   * it's gonna be thrown from the method immediately.
   *
   * @return {AsyncOptional<T|M>}
   * @throws {TypeError} if `optionalSupplier()` result is not an instance of AsyncOptional
   * @template T
   * @template M
   */
  orFlatCompute(optionalSupplier) {
    if (this.hasEmptyValue()) {
      return assertOptional(optionalSupplier());
    }

    if (this.hasSyncValue()) {
      return new AsyncOptional(this.value);
    }

    return new AsyncOptional(this.value
      .then(value =>
        isEmpty(value) ? ensureOptionalValue(optionalSupplier()) : value));
  }

  /**
   * Filters value based on the given predicate function.
   * If predicate executed on current value returns falsy result (or Promise of it),
   * returns empty AsyncOptional (with `null` as a value), otherwise takes current value.
   * Predicate function doesn't get executed if current value is empty.
   *
   * @param {function(T): Promise<boolean>|function(T): boolean} predicate filter
   * function with one argument to be used on the current AsyncOptional value; should return boolean
   * or Promise of boolean.
   *
   * Keep in mind, that if current value is plain and function throws an Error,
   * it's gonna be thrown from the method immediately.
   *
   * @return {AsyncOptional<T>|AsyncOptional<null>} new AsyncOptional instance with current or empty value
   * @template T
   */
  filter(predicate) {
    if (this.hasEmptyValue()) {
      return new AsyncOptional(this.value);
    }

    if (this.hasSyncValue()) {
      const predicateResult = predicate(this.value);

      if (isPromise(predicateResult)) {
        return new AsyncOptional(
          predicateResult.then(passed => passed ? this.value : null));
      }

      return predicateResult ?
        new AsyncOptional(this.value) :
        AsyncOptional.empty();
    }

    return new AsyncOptional(this.value.then(value => {
      if (isEmpty(value)) {
        return null;
      }

      return Promise.resolve(predicate(value))
        .then(passed => passed ? value : null);
    }));
  }

  /**
   * Similar to .map(value => value[property])
   * Takes property with given name from current value and returns new optional with it.
   *
   * @param {*} property property name (or index) to extract
   * @return {AsyncOptional}
   */
  take(property) {
    if (this.hasEmptyValue()) {
      return new AsyncOptional(this.value);
    }

    if (this.hasSyncValue()) {
      return new AsyncOptional(this.value[property]);
    }

    return new AsyncOptional(
      this.value.then(value => isEmpty(value) ? null : value[property]));
  }

  /**
   * Changes value based on given mapper function and returns new AsyncOptional with it.
   * Mapper function doesn't get executed if current value is empty.
   *
   * @param {function(T): Promise<M>|function(T): M} mapper function with one argument
   * which should return a value (or Promise of it) for a new AsyncOptional instance.
   *
   * Keep in mind, that if current value is plain and function throws an Error,
   * it's gonna be thrown from the method immediately.
   *
   * @return {AsyncOptional<M>} new AsyncOptional instance with mapped value
   * @template M
   * @template T
   */
  map(mapper) {
    if (this.hasEmptyValue()) {
      return new AsyncOptional(this.value);
    }

    if (this.hasSyncValue()) {
      return new AsyncOptional(mapper(this.value));
    }

    return new AsyncOptional(this.value
      .then(value => isEmpty(value) ? null : mapper(value)));
  }

  /**
   * Similar to {@link AsyncOptional#map}, except given mapper function returns
   * new instance of AsyncOptional to be used instead of current one.
   * Mapper function doesn't get executed if current value is empty.
   *
   * @param {function(T): AsyncOptional<M>} mapper function with one argument
   * which should return AsyncOptional instance (not Promise of it).
   *
   * Keep in mind, that if current value is plain and function throws an Error,
   * it's gonna be thrown from the method immediately.
   *
   * @return {AsyncOptional<M>} new AsyncOptional instance with mapped value
   * @throws {TypeError} if `mapper()` result is not an instance of AsyncOptional
   * @template M
   * @template T
   */
  flatMap(mapper) {
    if (this.hasEmptyValue()) {
      return new AsyncOptional(this.value);
    }

    if (this.hasSyncValue()) {
      const mapperResult = mapper(this.value);
      assertOptional(mapperResult);
      return mapperResult;
    }


    return new AsyncOptional(this.value.then(value => {
      if (isEmpty(value)) {
        return null;
      }

      return Promise.resolve(
        mapper(value)).then(ensureOptionalValue);
    }));
  }

  /**
   * Performs given action if current value is **not empty**
   *
   * @param {function(T): Promise<void>|function(T): void} action function with
   * one argument, can return Promise
   * @return {Promise<void>} Promise of action execution
   * @template T
   */
  ifPresent(action) {
    if (this.hasEmptyValue()) {
      return Promise.resolve();
    }

    if (this.hasSyncValue()) {
      return ensurePromise(action(this.value));
    }

    return this.value.then(value => {
      if (!isEmpty(value)) {
        return action(value);
      }
    });
  }

  /**
   * Performs given action if current value is **empty**
   *
   * @param {function(): Promise<void>|function(): void} action function with
   * no arguments, can return Promise
   * @return {Promise<void>} Promise of action execution
   */
  ifAbsent(action) {
    if (this.hasEmptyValue()) {
      return ensurePromise(action());
    }

    if (this.hasSyncValue()) {
      return Promise.resolve();
    }

    return this.value.then(value => {
      if (isEmpty(value)) {
        return action();
      }
    });
  }

  /**
   * Provides action to perform if optional value is **not empty**.
   * Must be followed by chained method `.or()` with action
   * to perform if optional value if **empty**.
   *
   * @example
   * ```
   * await AsyncOptional.with(getSomeValue())
   *   .either(x => printValue(x))
   *   .or(() => printError())
   * ```
   *
   * @param {function(T): Promise|function(T): void} actionOnPresence function
   * with one argument, can return Promise
   * @return {AsyncOptionalEither} chained instance with
   * singe {@link AsyncOptionalEither#or} method
   * @template T
   */
  either(actionOnPresence) {
    const actionPromise = this.ifPresent(actionOnPresence);
    return {
      or: actionOnAbsence =>
        actionPromise.then(() => this.ifAbsent(actionOnAbsence))
    };
  }


  /**
   * Provides actions to perform with optional value on presence and absence
   *
   * @param {function(T): Promise<void>|function(T): void} actionOnPresence
   * function with one argument to perform on non-empty value, can return Promise
   *
   * @param {function(): void|function(): Promise<void>} [actionOnAbsence]
   * function with no arguments to perform on empty value, can return Promise,
   * can be omitted
   * @return {Promise<void>} Promise one of the given actions execution
   * (which one is based on current value)
   */
  eitherOr(actionOnPresence, actionOnAbsence) {
    const hasActionOnAbsence = !isEmpty(actionOnAbsence);

    if (this.hasEmptyValue()) {
      return hasActionOnAbsence ?
        ensurePromise(actionOnAbsence()) :
        Promise.resolve();
    }

    if (this.hasSyncValue()) {
      return ensurePromise(actionOnPresence(this.value));
    }

    return this.value.then(value => {
      if (isEmpty(value)) {
        if (hasActionOnAbsence) {
          return actionOnAbsence();
        }
        return;
      }

      return actionOnPresence(value);
    });
  }


  /**
   * Checks if optional value is not empty (both `null` and `undefined` are considered empty)
   * @return {Promise<boolean>} promise resulting to true if value is not empty, to false otherwise
   */
  hasValue() {
    return ensurePromise(this.value).then(value => !isEmpty(value));
  }

  /**
   * Checks if optional value is empty  (both `null` and `undefined` are considered empty)
   * @return {Promise<boolean>} promise resulting to true if value is empty, to false otherwise
   */
  isEmpty() {
    return ensurePromise(this.value).then(value => isEmpty(value));
  }

  /**
   * Returns promise, resulting to the value, contained by the `AsyncOptional` instance
   * @return {Promise<T>} promise, resulting to the value of the optional
   * @template T
   */
  get() {
    return ensurePromise(this.value);
  }
}

module.exports = AsyncOptional;

/**
 * Chained interface for {@link AsyncOptional#either} method.
 * @class AsyncOptionalEither
 * @interface
 */

/**
 * Performs given action if current value is **empty**
 *
 * @method or
 * @memberOf AsyncOptionalEither#
 * @instance
 * @param {function(): void} actionOnAbsence function with no arguments,
 * can return Promise
 * @return {Promise<void>} Promise of one of the given actions execution
 * (which one - is based on the current value)
 */