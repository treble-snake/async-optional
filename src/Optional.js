const isEmpty = require('./util').isEmpty;

/**
 * Optional<T>
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
   * Creates an Optional with empty (null) value
   * @return {Optional<null>}
   */
  static empty() {
    return new Optional(null);
  }

  /**
   * Creates an optional with specified nullable value
   * @param {T} value
   * @return {Optional<T>}
   * @template T
   */
  static with(value) {
    return new Optional(value);
  }

  /**
   * Creates an optional with specified not nullable value.
   * If value is empty (null or undefined), throws {@link TypeError} exception.
   *
   * @param {!T} value
   * @return {Optional<T>}
   * @template T
   * @throws {TypeError}
   */
  static withEnsured(value) {
    if (isEmpty(value)) {
      throw new TypeError('Value can\'t be empty');
    }

    return new Optional(value);
  }

  /**
   * Creates a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with value of optional, returned by given supplier
   *
   * @param {function(): Optional<M>} optionalSupplier
   * @return {Optional<T|M>}
   * @template T
   * @template M
   */
  orFlatCompute(optionalSupplier) {
    return isEmpty(this.value) ?
      optionalSupplier() :
      new Optional(this.value);
  }

  /**
   * Creates a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with given value
   *
   * @param {M} newValue
   * @return {Optional<T|M>}
   * @template T
   * @template M
   */
  orUse(newValue) {
    return new Optional(isEmpty(this.value) ? newValue : this.value);
  }

  /**
   * Creates a new optional with one of two values:
   * - with current optional value, if it's not empty
   * - otherwise - with value returned by given supplier
   *
   * @param {function(): M} supplier
   * @return {Optional<T|M>}
   * @template T
   * @template M
   */
  orCompute(supplier) {
    return new Optional(isEmpty(this.value) ? supplier() : this.value);
  }

  /**
   * Checks if optional value is not empty
   * @return {boolean} true if value is not empty, false otherwise
   */
  isPresent() {
    return !isEmpty(this.value);
  }

  /**
   * Checks if optional value is empty
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

  /**
   * Provides action to perform if optional value is empty
   *
   * @param {function(T): void} action
   * @return {void}
   * @template T
   */
  ifPresent(action) {
    if (!isEmpty(this.value)) {
      action(this.value);
    }
  }

  /**
   * Provides action to perform if optional value is defined,
   * should be followed by chained method `.or()` with action
   * to perform if optional value if empty
   *
   * @param {function(T): void} actionOnPresence
   * @return {{or: (function(function(): *): void)}}
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
   * Provides actions to perform with optional value
   *
   * @param {function(T): void} actionOnPresence - executed only with non-empty values
   * @param {function(): void} [actionOnAbsence] - executed only if value is empty, can be omitted
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
   * Provides action to perform if optional value is empty
   *
   * @param {function(): void} action
   * @return {void}
   */
  ifEmpty(action) {
    if (isEmpty(this.value)) {
      action();
    }
  }

  /**
   * Filters value based on given predicate function.
   * If predicate executed on current value returns false, creates empty Optional,
   * otherwise takes current value.
   * Predicate function doesn't get executed if current value is empty
   *
   * @param {function(T): boolean} predicate
   * @return {Optional<T>} new Optional instance with current or empty value
   * @template T
   */
  filter(predicate) {
    if (!isEmpty(this.value) && predicate(this.value)) {
      return new Optional(this.value);
    }

    return Optional.empty();
  }

  /**
   * Changes value based on given mapper function.
   * Mapper function doesn't get executed if current value is empty
   *
   * @param {function(T): M} mapper
   * @return {Optional<M>} new Optional with mapped value
   * @template M
   * @template T
   */
  map(mapper) {
    return isEmpty(this.value) ?
      Optional.empty() :
      new Optional(mapper(this.value));
  }

  /**
   * @param {function(T): Optional<N>} mapper
   * @return {Optional<N>}
   * @template N
   * @template T
   * @throws {TypeError} if mapper's returned value is not an instance of Optional
   */
  flatMap(mapper) {
    if (isEmpty(this.value)) {
      return Optional.empty();
    }

    const newOptional = mapper(this.value);
    if (!(newOptional instanceof Optional)) {
      throw new TypeError('Flat mapper did not return an Optional');
    }

    return newOptional;
  }
}

module.exports = Optional;