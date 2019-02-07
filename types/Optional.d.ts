/**
 * `Optional` implementation which contains plain values (can't work with promises).
 * Can operate only with synchronous mappers, predicates and other callback functions.
 * But works faster than {@link AsyncOptional}
 */
export interface OptionalStatic {
    /**
     * Creates an Optional with empty (`null`) value
     */
    empty(): OptionalInstance<null>;

    /**
     * Creates an optional with specified value.
     * Value *can* be empty. Both `null` and `undefined` are considered empty.
     * @param value value to contain
     */
    with<T>(value?: T): OptionalInstance<T>;

    /**
     * Creates an optional with specified value.
     * Value **can not** be empty. Both `null` and `undefined` are considered empty.
     * If the value is empty, {@link TypeError} will be thrown.
     *
     * @param value value to contain
     * @throws {TypeError} if given value is either `null` or `undefined`
     */
    withEnsured<T>(value: T): OptionalInstance<T>;

    /**
     * @param value value to contain
     */
    new <T>(value: T): OptionalInstance<T>;
}

/**
 * Chained interface for {@link Optional#either} method.
 */
export interface OptionalEither {
    /**
     * Performs given action if current value is **empty**
     * @param actionOnAbsence function with no arguments
     */
    or(actionOnAbsence: () => any): void;
}

/**
 * `Optional` implementation which contains plain values (can't work with promises).
 * Can operate only with synchronous mappers, predicates and other callback functions.
 * But works faster than {@link AsyncOptional}
 */
export interface OptionalInstance<T> {
    /**
     * @param value value to contain
     */
    (value: T): OptionalInstance<T>;

    /**
     * Returns a new optional with one of two values:
     * - with current optional value, if it's not empty
     * - otherwise - with given value
     *
     * @param newValue value to use if current value is empty
     */
    orUse<M>(newValue: M): OptionalInstance<T | M>;

    /**
     * Returns a new optional with one of two values:
     * - with current optional value, if it's not empty
     * - otherwise - with value returned by given supplier
     *
     * @param supplier function with no arguments which
     * provides a new value for the Optional
     */
    orCompute<M>(supplier: () => M): OptionalInstance<T | M>;

    /**
     * Returns a new optional with one of two values:
     * - with current optional value, if it's not empty
     * - otherwise - with value of optional, returned by given supplier
     *
     * @param optionalSupplier function with no arguments which
     * should return another Optional instance to use instead of current one
     * (if current one is empty)
     * @throws {TypeError} if `optionalSupplier()` result is not an instance of Optional
     */
    orFlatCompute<M>(optionalSupplier: () => OptionalInstance<M>): OptionalInstance<T | M>;

    /**
     * Filters value based on the given predicate function.
     * If predicate executed on current value returns falsy result, returns empty Optional,
     * otherwise takes current value.
     * Predicate function doesn't get executed if current value is empty
     *
     * @param predicate filter function with one argument
     * to be used on the current Optional value; should return boolean
     * @return new Optional instance with current or empty value
     */
    filter(predicate: (value: T) => boolean): OptionalInstance<T | null>;

    /**
     * Similar to .map(value => value[property])
     * Takes property with given name from current value and returns new optional with it
     *
     * @param property property name (or index) to extract
     */
    take(property: any): OptionalInstance<any>;

    /**
     * Changes value based on given mapper function and returns new Optional with it.
     * Mapper function doesn't get executed if current value is empty
     *
     * @param mapper function with one argument
     * which should return a value for a new Optional instance.
     * @return new Optional with mapped value
     */
    map<M>(mapper: (value: T) => M): OptionalInstance<M>;

    /**
     * Similar to {@link Optional#map}, except given mapper function returns
     * new instance of Optional to be used instead of current one.
     * Mapper function doesn't get executed if current value is empty.
     *
     * @param mapper function with one argument
     * which should return Optional instance
     * @throws {TypeError} if mapper's returned value is not an instance of Optional
     */
    flatMap<M>(mapper: (value: T) => OptionalInstance<M>): OptionalInstance<M>;

    /**
     * Performs given action if current value is **not empty**
     *
     * @param action function with one argument
     */
    ifPresent(action: (value: T) => any): void;

    /**
     * Performs given action if current value is **empty**
     *
     * @param action function with no arguments
     */
    ifAbsent(action: () => any): void;

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
     * @param actionOnPresence function with one argument
     * @return chained instance with singe {@link OptionalEither#or} method
     */
    either(actionOnPresence: (value: T) => any): OptionalEither;

    /**
     * Provides actions to perform with optional value on presence and absence
     *
     * @param actionOnPresence
     * function with one argument to perform on non-empty value
     * @param [actionOnAbsence]
     * function with no arguments to perform if value is empty, can be omitted
     */
    eitherOr(actionOnPresence: (value: T) => any, actionOnAbsence?: () => any): void;

    /**
     * Checks if optional value is not empty (both `null` and `undefined` are considered empty)
     * @return true if value is not empty, false otherwise
     */
    hasValue(): boolean;

    /**
     * Checks if optional value is empty  (both `null` and `undefined` are considered empty)
     * @return true if value is empty, false otherwise
     */
    isEmpty(): boolean;

    /**
     * Returns current value of the Optional
     * @return current value of the optional
     */
    get(): T;
}

export const Optional: OptionalStatic;