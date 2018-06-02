const isEmpty = require('./util').isEmpty;

/**
 * @param {*} value
 * @return {Optional}
 * @throws {TypeError}
 * @private
 */
function assertOptional(value) {
  if (value instanceof Optional) {
    return value;
  }

  throw new TypeError('Optional expected');
}


/**
 * `Optional` implementation which can contain plain (can't work with promises)
 * Can operate with synchronous mappers, predicates and other callback functions only.
 * But works faster than {@link AsyncOptional}
 *
 * @class
 * @template T
 */
class Optional {

  /**
   * @param {*} value value to contain
   */
  constructor(value) {
    /**
     * @private
     * @type {T}
     */
    this.value = value;
  }

  /**
   * Creates an Optional with empty (`null`) value
   * @return {Optional<null>}
   */
  static empty() {
    return new Optional(null);
  }

  /**
   * Creates an optional with specified value.
   * Value *can* be empty. Both `null` and `undefined` are considered empty.
   * @param {T} value value to contain
   * @return {Optional<T>}
   * @template T
   */
  static with(value) {
    return new Optional(value);
  }

  /**
   * Creates an optional with specified value.
   * Value **can not** be empty. Both `null` and `undefined` are considered empty.
   * If the value (or result of a promise) is empty, {@link TypeError} will be thrown.
   *
   * @param {!T} value value to contain
   * @return {Optional<T>}
   * @throws {TypeError} if given value is either `null` or `undefined`
   * @template T
   */
  static withEnsured(value) {
    if (isEmpty(value)) {
      throw new TypeError('Value can\'t be empty');
    }

    return new Optional(value);
  }

  /**
   * Returns a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with given value
   *
   * @param {M} newValue value to use if current value is empty
   * @return {Optional<T|M>}
   * @template T
   * @template M
   */
  orUse(newValue) {
    return new Optional(isEmpty(this.value) ? newValue : this.value);
  }

  /**
   * Returns a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with value returned by given supplier
   *
   * @param {function(): M} supplier function with no arguments which
   * provides a new value for the Optional
   * @return {Optional<T|M>}
   * @template T
   * @template M
   */
  orCompute(supplier) {
    return new Optional(isEmpty(this.value) ? supplier() : this.value);
  }

  /**
   * Returns a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with value of optional, returned by given supplier
   *
   * @param {function(): Optional<M>} optionalSupplier function with no arguments which
   * should return another AsyncOptional instance to use instead of current one
   * (if current one is empty)
   * @return {Optional<T|M>}
   * @throws {TypeError} if `optionalSupplier()` result is not an instance of Optional
   * @template T
   * @template M
   */
  orFlatCompute(optionalSupplier) {
    return isEmpty(this.value) ?
      assertOptional(optionalSupplier()) :
      new Optional(this.value);
  }

  /**
   * Filters value based on the given predicate function.
   * If predicate executed on current value returns falsy result, returns empty Optional,
   * otherwise takes current value.
   * Predicate function doesn't get executed if current value is empty
   *
   * @param {function(T): boolean} predicate filter function with one argument
   * to be used on the current Optional value; should return boolean
   * @return {Optional<T>|Optional<null>} new Optional instance with current or empty value
   * @template T
   */
  filter(predicate) {
    if (isEmpty(this.value) || predicate(this.value)) {
      return new Optional(this.value);
    }

    return Optional.empty();
  }

  /**
   * Similar to .map(value => value[property])
   * Takes property with given name from current value and returns new optional with it
   *
   * @param {*} property property name (or index) to extract
   * @return {Optional}
   */
  take(property) {
    return isEmpty(this.value) ?
      new Optional(this.value) :
      Optional.with(this.value[property]);
  }

  /**
   * Changes value based on given mapper function and returns new Optional with it.
   * Mapper function doesn't get executed if current value is empty
   *
   * @param {function(T): M} mapper function with one argument
   * which should return a value for a new Optional instance.
   * @return {Optional<M>} new Optional with mapped value
   * @template M
   * @template T
   */
  map(mapper) {
    return isEmpty(this.value) ?
      new Optional(this.value) :
      new Optional(mapper(this.value));
  }

  /**
   * Similar to {@link Optional#map}, except given mapper function returns
   * new instance of Optional to be used instead of current one.
   * Mapper function doesn't get executed if current value is empty.
   *
   * @param {function(T): Optional<N>} mapper function with one argument
   * which should return Optional instance
   * @return {Optional<N>}
   * @template N
   * @template T
   * @throws {TypeError} if mapper's returned value is not an instance of Optional
   */
  flatMap(mapper) {
    return isEmpty(this.value) ?
      new Optional(this.value) :
      assertOptional(mapper(this.value));
  }

  /**
   * Performs given action if current value is **not empty**
   *
   * @param {function(T): void} action function with one argument
   * @return {void}
   * @template T
   */
  ifPresent(action) {
    if (!isEmpty(this.value)) {
      action(this.value);
    }
  }

  /**
   * Performs given action if current value is **empty**
   *
   * @param {function(): void} action function with no arguments
   * @return {void}
   */
  ifEmpty(action) {
    if (isEmpty(this.value)) {
      action();
    }
  }

  /**
   * Provides action to perform if optional value is **not empty**.
   * Must be followed by chained method `.or()` with action
   * to perform if optional value if **empty**.
   *
   * @example
   * ```
   * Optional.with(getSomeValue())
   *   .either(x => printValue(x))
   *   .or(() => printError())
   * ```
   *
   * @param {function(T): void} actionOnPresence function with one argument
   * @return {OptionalEither} chained instance with
   * singe {@link AsyncOptionalEither#or} method
   * @template T
   */
  either(actionOnPresence) {
    this.ifPresent(actionOnPresence);
    return {
      or: actionOnAbsence => {
        this.ifEmpty(actionOnAbsence);
      }
    };
  }

  /**
   * Provides actions to perform with optional value on presence and absence
   *
   * @param {function(T): void} actionOnPresence
   * function with one argument to perform on non-empty value
   * @param {function(): void} [actionOnAbsence]
   * function with no arguments to perform if value is empty, can be omitted
   * @return {void}
   * @template T
   */
  eitherOr(actionOnPresence, actionOnAbsence) {
    if (isEmpty(this.value)) {
      if (!isEmpty(actionOnAbsence)) {
        actionOnAbsence();
        return;
      }
      return;
    }

    actionOnPresence(this.value);
  }

  /**
   * Checks if optional value is not empty (both `null` and `undefined` are considered empty)
   * @return {boolean} true if value is not empty, false otherwise
   */
  isPresent() {
    return !isEmpty(this.value);
  }

  /**
   * Checks if optional value is empty  (both `null` and `undefined` are considered empty)
   * @return {boolean} true if value is empty, false otherwise
   */
  isEmpty() {
    return isEmpty(this.value);
  }

  /**
   * Returns current value of the Optional
   * @return {T} current value of the optional
   * @template T
   */
  get() {
    return this.value;
  }
}

module.exports = Optional;

/**
 * Chained interface for {@link Optional#either} method.
 * @class OptionalEither
 * @interface
 */

/**
 * Performs given action if current value is **empty**
 *
 * @method or
 * @memberOf OptionalEither#
 * @instance
 * @param {function(): void} actionOnAbsence function with no arguments
 * @return {void}
 */