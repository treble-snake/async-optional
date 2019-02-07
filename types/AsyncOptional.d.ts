/**
 * `Optional` implementation which can contain both plain values and
 * promises resolving to a value.
 * It also can operate with both synchronous and asynchronous mappers,
 * predicates, actions and other callback functions.
 */
export interface AsyncOptionalStatic {
    /**
     * @param value value to contain
     */
    new<T>(value: T | Promise<T>): AsyncOptionalInstance<T>;

    /**
     * Creates an AsyncOptional with empty (`null`) value
     */
    empty(): AsyncOptionalInstance<null>;

    /**
     * Creates an optional with specified value (which can be a promise).
     * Value *can* be empty. Both `null` and `undefined` are considered empty.
     * @param value value to contain
     */
    with<T>(value?: T | Promise<T>): AsyncOptionalInstance<T>;

    /**
     * Creates an optional with specified value.
     * Value **can not** be empty. Both `null` and `undefined` are considered empty.
     * If the value (or result of a promise) is empty (null or undefined),
     * {@link TypeError} exception will be thrown as soon as possible -
     * e.g. for plain values it will be thrown at once, and for promises -
     * on attempt of getting result by calling one of
     * final methods (like {@link AsyncOptional#eitherOr},
     * {@link AsyncOptionalInstance#get}, etc).
     *
     * @param value value to contain
     * @throws {TypeError} if given value is either `null` or `undefined`
     */
    withEnsured<T>(value: T | Promise<T>): AsyncOptionalInstance<T>;
}

/**
 * Chained interface for {@link AsyncOptional#either} method.
 */
export interface AsyncOptionalEither {
    /**
     * Performs given action if current value is **empty**
     * @param actionOnAbsence function with no arguments,
     * can return Promise
     * @return Promise of one of the given actions execution
     * (which one - is based on the current value)
     */
    or(actionOnAbsence: () => any): Promise<void>
}

/**
 * `Optional` implementation which can contain both plain values and
 * promises resolving to a value.
 * It also can operate with both synchronous and asynchronous mappers,
 * predicates, actions and other callback functions.
 */
export interface AsyncOptionalInstance<T> {
    /**
     * Returns a new optional with one of two values:
     * - with current optional value, if it's not empty
     * - otherwise - with given value
     *
     * @param newValue value to use if current value is empty;
     * can be a promise (resolved value will be used)
     */
    orUse<M>(newValue: Promise<M> | M): AsyncOptionalInstance<T | M>;

    /**
     * Returns a new optional with one of two values:
     * - with current optional value, if it's not empty
     * - otherwise - with a returned by given supplier value
     *
     * @param supplier function with no arguments which
     * provides a new value for the AsyncOptional; can return a plain value or a promise.
     *
     * Keep in mind, that if current value is plain and supplier function throws an Error,
     * it's gonna be thrown from the method immediately.
     */
    orCompute<M>(supplier: () => (Promise<M> | M)): AsyncOptionalInstance<T | M>;

    /**
     * Returns a new optional with one of two values:
     * - with current optional value, if it's not empty
     * - otherwise - with value of optional, returned by given supplier
     *
     * @param optionalSupplier function with no arguments which
     * should return another AsyncOptional instance to use instead of current one
     * (if current one is empty); can not return Promise (which makes sense 'cause
     * it can be the value of AsyncOptional)
     *
     * Keep in mind, that if current value is plain and function throws an Error,
     * it's gonna be thrown from the method immediately.
     *
     * @throws {TypeError} if `optionalSupplier()` result is not an instance of AsyncOptional
     */
    orFlatCompute<M>(optionalSupplier: () => AsyncOptionalInstance<M>): AsyncOptionalInstance<T | M>;

    /**
     * Filters value based on the given predicate function.
     * If predicate executed on current value returns falsy result (or Promise of it),
     * returns empty AsyncOptional (with `null` as a value), otherwise takes current value.
     * Predicate function doesn't get executed if current value is empty.
     *
     * @param predicate filter
     * function with one argument to be used on the current AsyncOptional value; should return boolean
     * or Promise of boolean.
     *
     * Keep in mind, that if current value is plain and function throws an Error,
     * it's gonna be thrown from the method immediately.
     *
     * @return new AsyncOptional instance with current or empty value
     */
    filter(predicate: (value: T) => (boolean | Promise<boolean>)): AsyncOptionalInstance<T | null>;

    /**
     * Similar to .map(value => value[property])
     * Takes property with given name from current value and returns new optional with it.
     *
     * @param property property name (or index) to extract
     */
    take(property: any): AsyncOptionalInstance<any>;

    /**
     * Changes value based on given mapper function and returns new AsyncOptional with it.
     * Mapper function doesn't get executed if current value is empty.
     *
     * @param mapper function with one argument
     * which should return a value (or Promise of it) for a new AsyncOptional instance.
     *
     * Keep in mind, that if current value is plain and function throws an Error,
     * it's gonna be thrown from the method immediately.
     *
     * @return new AsyncOptional instance with mapped value
     */
    map<M>(mapper: (value: T) => (Promise<M> | M)): AsyncOptionalInstance<M>;

    /**
     * Similar to {@link AsyncOptional#map}, except given mapper function returns
     * new instance of AsyncOptional to be used instead of current one.
     * Mapper function doesn't get executed if current value is empty.
     *
     * @param mapper function with one argument
     * which should return AsyncOptional instance (not Promise of it).
     *
     * Keep in mind, that if current value is plain and function throws an Error,
     * it's gonna be thrown from the method immediately.
     *
     * @return new AsyncOptional instance with mapped value
     * @throws {TypeError} if `mapper()` result is not an instance of AsyncOptional
     */
    flatMap<M>(mapper: (value: T) => AsyncOptionalInstance<M>): AsyncOptionalInstance<M>;

    /**
     * Performs given action if current value is **not empty**
     *
     * @param action function with one argument, can return Promise
     * @return Promise of action execution
     */
    ifPresent(action: (value: T) => (Promise<any> | any)): Promise<void>;

    /**
     * Performs given action if current value is **empty**
     *
     * @param action function with no arguments, can return Promise
     * @return Promise of action execution
     */
    ifAbsent(action: () => (Promise<any> | any)): Promise<void>;

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
     * @param actionOnPresence function with one argument, can return Promise
     * @return chained instance with singe {@link AsyncOptionalEither#or} method
     */
    either(actionOnPresence: (value: T) => (Promise<any> | any)): AsyncOptionalEither;

    /**
     * Provides actions to perform with optional value on presence and absence
     *
     * @param actionOnPresence
     * function with one argument to perform on non-empty value, can return Promise
     *
     * @param [actionOnAbsence]
     * function with no arguments to perform on empty value, can return Promise,
     * can be omitted
     * @return Promise one of the given actions execution
     * (which one is based on current value)
     */
    eitherOr(
        actionOnPresence: (value: T) => (Promise<any> | any),
        actionOnAbsence?: () => (Promise<any> | any)
    ): Promise<void>;

    /**
     * Checks if optional value is not empty (both `null` and `undefined` are considered empty)
     * @return promise resulting to true if value is not empty, to false otherwise
     */
    hasValue(): Promise<boolean>;

    /**
     * Checks if optional value is empty  (both `null` and `undefined` are considered empty)
     * @return promise resulting to true if value is empty, to false otherwise
     */
    isEmpty(): Promise<boolean>;

    /**
     * Returns promise, resulting to the value, contained by the `AsyncOptional` instance
     * @return promise, resulting to the value of the optional
     */
    get(): Promise<T>;
}

export const AsyncOptional: AsyncOptionalStatic;