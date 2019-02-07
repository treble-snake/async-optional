## Classes

<dl>
<dt><a href="#AsyncOptional">AsyncOptional</a></dt>
<dd><p><code>Optional</code> implementation which can contain both plain values and
promises resolving to a value.
It also can operate with both synchronous and asynchronous mappers,
predicates, actions and other callback functions.</p>
</dd>
<dt><a href="#Optional">Optional</a></dt>
<dd><p><code>Optional</code> implementation which contains plain values (can&#39;t work with promises).
Can operate only with synchronous mappers, predicates and other callback functions.
But works faster than <a href="#AsyncOptional">AsyncOptional</a></p>
</dd>
</dl>

## Interfaces

<dl>
<dt><a href="#AsyncOptionalEither">AsyncOptionalEither</a></dt>
<dd><p>Chained interface for <a href="#AsyncOptional+either">either</a> method.</p>
</dd>
<dt><a href="#OptionalEither">OptionalEither</a></dt>
<dd><p>Chained interface for <a href="#Optional+either">either</a> method.</p>
</dd>
</dl>

<a name="AsyncOptionalEither"></a>

## AsyncOptionalEither
Chained interface for [either](#AsyncOptional+either) method.

**Kind**: global interface  
<a name="AsyncOptionalEither+or"></a>

### asyncOptionalEither.or(actionOnAbsence) ⇒ <code>Promise.&lt;void&gt;</code>
Performs given action if current value is **empty**

**Kind**: instance method of [<code>AsyncOptionalEither</code>](#AsyncOptionalEither)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise of one of the given actions execution
(which one - is based on the current value)  

| Param | Type | Description |
| --- | --- | --- |
| actionOnAbsence | <code>function</code> | function with no arguments, can return Promise |

<a name="OptionalEither"></a>

## OptionalEither
Chained interface for [either](#Optional+either) method.

**Kind**: global interface  
<a name="OptionalEither+or"></a>

### optionalEither.or(actionOnAbsence) ⇒ <code>void</code>
Performs given action if current value is **empty**

**Kind**: instance method of [<code>OptionalEither</code>](#OptionalEither)  

| Param | Type | Description |
| --- | --- | --- |
| actionOnAbsence | <code>function</code> | function with no arguments |

<a name="AsyncOptional"></a>

## AsyncOptional
`Optional` implementation which can contain both plain values and
promises resolving to a value.
It also can operate with both synchronous and asynchronous mappers,
predicates, actions and other callback functions.

**Kind**: global class  
**Template**: T  

* [AsyncOptional](#AsyncOptional)
    * [new AsyncOptional(value)](#new_AsyncOptional_new)
    * _instance_
        * [.orUse(newValue)](#AsyncOptional+orUse) ⇒ <code>AsyncOptional.&lt;(T\|M)&gt;</code>
        * [.orCompute(supplier)](#AsyncOptional+orCompute) ⇒ <code>AsyncOptional.&lt;(T\|M)&gt;</code>
        * [.orFlatCompute(optionalSupplier)](#AsyncOptional+orFlatCompute) ⇒ <code>AsyncOptional.&lt;(T\|M)&gt;</code>
        * [.filter(predicate)](#AsyncOptional+filter) ⇒ <code>AsyncOptional.&lt;T&gt;</code> \| <code>AsyncOptional.&lt;null&gt;</code>
        * [.take(property)](#AsyncOptional+take) ⇒ [<code>AsyncOptional</code>](#AsyncOptional)
        * [.map(mapper)](#AsyncOptional+map) ⇒ <code>AsyncOptional.&lt;M&gt;</code>
        * [.flatMap(mapper)](#AsyncOptional+flatMap) ⇒ <code>AsyncOptional.&lt;M&gt;</code>
        * [.ifPresent(action)](#AsyncOptional+ifPresent) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.ifAbsent(action)](#AsyncOptional+ifAbsent) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.either(actionOnPresence)](#AsyncOptional+either) ⇒ [<code>AsyncOptionalEither</code>](#AsyncOptionalEither)
        * [.eitherOr(actionOnPresence, [actionOnAbsence])](#AsyncOptional+eitherOr) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.hasValue()](#AsyncOptional+hasValue) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.isEmpty()](#AsyncOptional+isEmpty) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.get()](#AsyncOptional+get) ⇒ <code>Promise.&lt;T&gt;</code>
    * _static_
        * [.empty()](#AsyncOptional.empty) ⇒ <code>AsyncOptional.&lt;null&gt;</code>
        * [.with(value)](#AsyncOptional.with) ⇒ <code>AsyncOptional.&lt;T&gt;</code>
        * [.withEnsured(value)](#AsyncOptional.withEnsured) ⇒ <code>AsyncOptional.&lt;T&gt;</code>

<a name="new_AsyncOptional_new"></a>

### new AsyncOptional(value)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Promise.&lt;T&gt;</code> \| <code>T</code> | value to contain |

<a name="AsyncOptional+orUse"></a>

### asyncOptional.orUse(newValue) ⇒ <code>AsyncOptional.&lt;(T\|M)&gt;</code>
Returns a new optional with one of two values:
- with current optional value, if it's not empty
- otherwise - with given value

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Template**: T  
**Template**: M  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>Promise.&lt;M&gt;</code> \| <code>M</code> | value to use if current value is empty; can be a promise (resolved value will be used) |

<a name="AsyncOptional+orCompute"></a>

### asyncOptional.orCompute(supplier) ⇒ <code>AsyncOptional.&lt;(T\|M)&gt;</code>
Returns a new optional with one of two values:
- with current optional value, if it's not empty
- otherwise - with a returned by given supplier value

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Template**: T  
**Template**: M  

| Param | Type | Description |
| --- | --- | --- |
| supplier | <code>function</code> | function with no arguments which provides a new value for the AsyncOptional; can return a plain value or a promise. Keep in mind, that if current value is plain and supplier function throws an Error, it's gonna be thrown from the method immediately. |

<a name="AsyncOptional+orFlatCompute"></a>

### asyncOptional.orFlatCompute(optionalSupplier) ⇒ <code>AsyncOptional.&lt;(T\|M)&gt;</code>
Returns a new optional with one of two values:
- with current optional value, if it's not empty
- otherwise - with value of optional, returned by given supplier

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Throws**:

- <code>TypeError</code> if `optionalSupplier()` result is not an instance of AsyncOptional

**Template**: T  
**Template**: M  

| Param | Type | Description |
| --- | --- | --- |
| optionalSupplier | <code>function</code> | function with no arguments which should return another AsyncOptional instance to use instead of current one (if current one is empty); can not return Promise (which makes sense 'cause it can be the value of AsyncOptional) Keep in mind, that if current value is plain and function throws an Error, it's gonna be thrown from the method immediately. |

<a name="AsyncOptional+filter"></a>

### asyncOptional.filter(predicate) ⇒ <code>AsyncOptional.&lt;T&gt;</code> \| <code>AsyncOptional.&lt;null&gt;</code>
Filters value based on the given predicate function.
If predicate executed on current value returns falsy result (or Promise of it),
returns empty AsyncOptional (with `null` as a value), otherwise takes current value.
Predicate function doesn't get executed if current value is empty.

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: <code>AsyncOptional.&lt;T&gt;</code> \| <code>AsyncOptional.&lt;null&gt;</code> - new AsyncOptional instance with current or empty value  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | filter function with one argument to be used on the current AsyncOptional value; should return boolean or Promise of boolean. Keep in mind, that if current value is plain and function throws an Error, it's gonna be thrown from the method immediately. |

<a name="AsyncOptional+take"></a>

### asyncOptional.take(property) ⇒ [<code>AsyncOptional</code>](#AsyncOptional)
Similar to .map(value => value[property])
Takes property with given name from current value and returns new optional with it.

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>\*</code> | property name (or index) to extract |

<a name="AsyncOptional+map"></a>

### asyncOptional.map(mapper) ⇒ <code>AsyncOptional.&lt;M&gt;</code>
Changes value based on given mapper function and returns new AsyncOptional with it.
Mapper function doesn't get executed if current value is empty.

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: <code>AsyncOptional.&lt;M&gt;</code> - new AsyncOptional instance with mapped value  
**Template**: M  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| mapper | <code>function</code> | function with one argument which should return a value (or Promise of it) for a new AsyncOptional instance. Keep in mind, that if current value is plain and function throws an Error, it's gonna be thrown from the method immediately. |

<a name="AsyncOptional+flatMap"></a>

### asyncOptional.flatMap(mapper) ⇒ <code>AsyncOptional.&lt;M&gt;</code>
Similar to [map](#AsyncOptional+map), except given mapper function returns
new instance of AsyncOptional to be used instead of current one.
Mapper function doesn't get executed if current value is empty.

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: <code>AsyncOptional.&lt;M&gt;</code> - new AsyncOptional instance with mapped value  
**Throws**:

- <code>TypeError</code> if `mapper()` result is not an instance of AsyncOptional

**Template**: M  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| mapper | <code>function</code> | function with one argument which should return AsyncOptional instance (not Promise of it). Keep in mind, that if current value is plain and function throws an Error, it's gonna be thrown from the method immediately. |

<a name="AsyncOptional+ifPresent"></a>

### asyncOptional.ifPresent(action) ⇒ <code>Promise.&lt;void&gt;</code>
Performs given action if current value is **not empty**

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise of action execution  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>function</code> | function with one argument, can return Promise |

<a name="AsyncOptional+ifAbsent"></a>

### asyncOptional.ifAbsent(action) ⇒ <code>Promise.&lt;void&gt;</code>
Performs given action if current value is **empty**

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise of action execution  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>function</code> | function with no arguments, can return Promise |

<a name="AsyncOptional+either"></a>

### asyncOptional.either(actionOnPresence) ⇒ [<code>AsyncOptionalEither</code>](#AsyncOptionalEither)
Provides action to perform if optional value is **not empty**.
Must be followed by chained method `.or()` with action
to perform if optional value if **empty**.

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: [<code>AsyncOptionalEither</code>](#AsyncOptionalEither) - chained instance with
singe [or](#AsyncOptionalEither+or) method  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| actionOnPresence | <code>function</code> | function with one argument, can return Promise |

**Example**  
```
await AsyncOptional.with(getSomeValue())
  .either(x => printValue(x))
  .or(() => printError())
```
<a name="AsyncOptional+eitherOr"></a>

### asyncOptional.eitherOr(actionOnPresence, [actionOnAbsence]) ⇒ <code>Promise.&lt;void&gt;</code>
Provides actions to perform with optional value on presence and absence

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise one of the given actions execution
(which one is based on current value)  

| Param | Type | Description |
| --- | --- | --- |
| actionOnPresence | <code>function</code> | function with one argument to perform on non-empty value, can return Promise |
| [actionOnAbsence] | <code>function</code> | function with no arguments to perform on empty value, can return Promise, can be omitted |

<a name="AsyncOptional+hasValue"></a>

### asyncOptional.hasValue() ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if optional value is not empty (both `null` and `undefined` are considered empty)

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - promise resulting to true if value is not empty, to false otherwise  
<a name="AsyncOptional+isEmpty"></a>

### asyncOptional.isEmpty() ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if optional value is empty  (both `null` and `undefined` are considered empty)

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - promise resulting to true if value is empty, to false otherwise  
<a name="AsyncOptional+get"></a>

### asyncOptional.get() ⇒ <code>Promise.&lt;T&gt;</code>
Returns promise, resulting to the value, contained by the `AsyncOptional` instance

**Kind**: instance method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Returns**: <code>Promise.&lt;T&gt;</code> - promise, resulting to the value of the optional  
**Template**: T  
<a name="AsyncOptional.empty"></a>

### AsyncOptional.empty() ⇒ <code>AsyncOptional.&lt;null&gt;</code>
Creates an AsyncOptional with empty (`null`) value

**Kind**: static method of [<code>AsyncOptional</code>](#AsyncOptional)  
<a name="AsyncOptional.with"></a>

### AsyncOptional.with(value) ⇒ <code>AsyncOptional.&lt;T&gt;</code>
Creates an optional with specified value (which can be a promise).
Value *can* be empty. Both `null` and `undefined` are considered empty.

**Kind**: static method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Promise.&lt;T&gt;</code> \| <code>T</code> | value to contain |

<a name="AsyncOptional.withEnsured"></a>

### AsyncOptional.withEnsured(value) ⇒ <code>AsyncOptional.&lt;T&gt;</code>
Creates an optional with specified value.
Value **can not** be empty. Both `null` and `undefined` are considered empty.
If the value (or result of a promise) is empty (null or undefined),
[TypeError](TypeError) exception will be thrown as soon as possible -
e.g. for plain values it will be thrown at once, and for promises -
on attempt of getting result by calling one of
final methods (like [eitherOr](eitherOr), [get](get), etc).

**Kind**: static method of [<code>AsyncOptional</code>](#AsyncOptional)  
**Throws**:

- <code>TypeError</code> if given value is either `null` or `undefined`

**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>!Promise.&lt;T&gt;</code> \| <code>T</code> | value to contain |

<a name="Optional"></a>

## Optional
`Optional` implementation which contains plain values (can't work with promises).
Can operate only with synchronous mappers, predicates and other callback functions.
But works faster than [AsyncOptional](#AsyncOptional)

**Kind**: global class  
**Template**: T  

* [Optional](#Optional)
    * [new Optional(value)](#new_Optional_new)
    * _instance_
        * [.orUse(newValue)](#Optional+orUse) ⇒ <code>Optional.&lt;(T\|M)&gt;</code>
        * [.orCompute(supplier)](#Optional+orCompute) ⇒ <code>Optional.&lt;(T\|M)&gt;</code>
        * [.orFlatCompute(optionalSupplier)](#Optional+orFlatCompute) ⇒ <code>Optional.&lt;(T\|M)&gt;</code>
        * [.filter(predicate)](#Optional+filter) ⇒ <code>Optional.&lt;T&gt;</code> \| <code>Optional.&lt;null&gt;</code>
        * [.take(property)](#Optional+take) ⇒ <code>Optional.&lt;\*&gt;</code>
        * [.map(mapper)](#Optional+map) ⇒ <code>Optional.&lt;M&gt;</code>
        * [.flatMap(mapper)](#Optional+flatMap) ⇒ <code>Optional.&lt;M&gt;</code>
        * [.ifPresent(action)](#Optional+ifPresent) ⇒ <code>void</code>
        * [.ifAbsent(action)](#Optional+ifAbsent) ⇒ <code>void</code>
        * [.either(actionOnPresence)](#Optional+either) ⇒ [<code>OptionalEither</code>](#OptionalEither)
        * [.eitherOr(actionOnPresence, [actionOnAbsence])](#Optional+eitherOr) ⇒ <code>void</code>
        * [.hasValue()](#Optional+hasValue) ⇒ <code>boolean</code>
        * [.isEmpty()](#Optional+isEmpty) ⇒ <code>boolean</code>
        * [.get()](#Optional+get) ⇒ <code>T</code>
    * _static_
        * [.empty()](#Optional.empty) ⇒ <code>Optional.&lt;null&gt;</code>
        * [.with(value)](#Optional.with) ⇒ <code>Optional.&lt;T&gt;</code>
        * [.withEnsured(value)](#Optional.withEnsured) ⇒ <code>Optional.&lt;T&gt;</code>

<a name="new_Optional_new"></a>

### new Optional(value)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | value to contain |

<a name="Optional+orUse"></a>

### optional.orUse(newValue) ⇒ <code>Optional.&lt;(T\|M)&gt;</code>
Returns a new optional with one of two values:
- with current optional value, if it's not empty
- otherwise - with given value

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Template**: T  
**Template**: M  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>M</code> | value to use if current value is empty |

<a name="Optional+orCompute"></a>

### optional.orCompute(supplier) ⇒ <code>Optional.&lt;(T\|M)&gt;</code>
Returns a new optional with one of two values:
- with current optional value, if it's not empty
- otherwise - with value returned by given supplier

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Template**: T  
**Template**: M  

| Param | Type | Description |
| --- | --- | --- |
| supplier | <code>function</code> | function with no arguments which provides a new value for the Optional |

<a name="Optional+orFlatCompute"></a>

### optional.orFlatCompute(optionalSupplier) ⇒ <code>Optional.&lt;(T\|M)&gt;</code>
Returns a new optional with current optional value, if it's not empty
Otherwise - return an optional provided by given supplier

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Throws**:

- <code>TypeError</code> if `optionalSupplier()` result is not an instance of Optional

**Template**: T  
**Template**: M  

| Param | Type | Description |
| --- | --- | --- |
| optionalSupplier | <code>function</code> | function with no arguments which should return another Optional instance to use instead of current one (if current one is empty) |

<a name="Optional+filter"></a>

### optional.filter(predicate) ⇒ <code>Optional.&lt;T&gt;</code> \| <code>Optional.&lt;null&gt;</code>
Filters value based on the given predicate function.
If predicate executed on current value returns falsy result, returns empty Optional,
otherwise takes current value.
Predicate function doesn't get executed if current value is empty

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Returns**: <code>Optional.&lt;T&gt;</code> \| <code>Optional.&lt;null&gt;</code> - new Optional instance with current or empty value  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | filter function with one argument to be used on the current Optional value; should return boolean |

<a name="Optional+take"></a>

### optional.take(property) ⇒ <code>Optional.&lt;\*&gt;</code>
Similar to .map(value => value[property])
Takes property with given name from current value and returns new optional with it

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Returns**: <code>Optional.&lt;\*&gt;</code> - new Optional instance with the value for given property name  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>\*</code> | property name (or index) to extract |

<a name="Optional+map"></a>

### optional.map(mapper) ⇒ <code>Optional.&lt;M&gt;</code>
Changes value based on given mapper function and returns new Optional with it.
Mapper function doesn't get executed if current value is empty

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Returns**: <code>Optional.&lt;M&gt;</code> - new Optional with mapped value  
**Template**: M  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| mapper | <code>function</code> | function with one argument which should return a value for a new Optional instance. |

<a name="Optional+flatMap"></a>

### optional.flatMap(mapper) ⇒ <code>Optional.&lt;M&gt;</code>
Similar to [map](#Optional+map), except given mapper function returns
new instance of Optional to be used instead of current one.
Mapper function doesn't get executed if current value is empty.

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Throws**:

- <code>TypeError</code> if mapper's returned value is not an instance of Optional

**Template**: M  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| mapper | <code>function</code> | function with one argument which should return Optional instance |

<a name="Optional+ifPresent"></a>

### optional.ifPresent(action) ⇒ <code>void</code>
Performs given action if current value is **not empty**

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>function</code> | function with one argument |

<a name="Optional+ifAbsent"></a>

### optional.ifAbsent(action) ⇒ <code>void</code>
Performs given action if current value is **empty**

**Kind**: instance method of [<code>Optional</code>](#Optional)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>function</code> | function with no arguments |

<a name="Optional+either"></a>

### optional.either(actionOnPresence) ⇒ [<code>OptionalEither</code>](#OptionalEither)
Provides action to perform if optional value is **not empty**.
Must be followed by chained method `.or()` with action
to perform if optional value if **empty**.

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Returns**: [<code>OptionalEither</code>](#OptionalEither) - chained instance with
singe [or](#AsyncOptionalEither+or) method  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| actionOnPresence | <code>function</code> | function with one argument |

**Example**  
```
Optional.with(getSomeValue())
  .either(x => printValue(x))
  .or(() => printError())
```
<a name="Optional+eitherOr"></a>

### optional.eitherOr(actionOnPresence, [actionOnAbsence]) ⇒ <code>void</code>
Provides actions to perform with optional value on presence and absence

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| actionOnPresence | <code>function</code> | function with one argument to perform on non-empty value |
| [actionOnAbsence] | <code>function</code> | function with no arguments to perform if value is empty, can be omitted |

<a name="Optional+hasValue"></a>

### optional.hasValue() ⇒ <code>boolean</code>
Checks if optional value is not empty (both `null` and `undefined` are considered empty)

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Returns**: <code>boolean</code> - true if value is not empty, false otherwise  
<a name="Optional+isEmpty"></a>

### optional.isEmpty() ⇒ <code>boolean</code>
Checks if optional value is empty  (both `null` and `undefined` are considered empty)

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Returns**: <code>boolean</code> - true if value is empty, false otherwise  
<a name="Optional+get"></a>

### optional.get() ⇒ <code>T</code>
Returns current value of the Optional

**Kind**: instance method of [<code>Optional</code>](#Optional)  
**Returns**: <code>T</code> - current value of the optional  
**Template**: T  
<a name="Optional.empty"></a>

### Optional.empty() ⇒ <code>Optional.&lt;null&gt;</code>
Creates an Optional with empty (`null`) value

**Kind**: static method of [<code>Optional</code>](#Optional)  
<a name="Optional.with"></a>

### Optional.with(value) ⇒ <code>Optional.&lt;T&gt;</code>
Creates an optional with specified value.
Value *can* be empty. Both `null` and `undefined` are considered empty.

**Kind**: static method of [<code>Optional</code>](#Optional)  
**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>T</code> | value to contain |

<a name="Optional.withEnsured"></a>

### Optional.withEnsured(value) ⇒ <code>Optional.&lt;T&gt;</code>
Creates an optional with specified value.
Value **can not** be empty. Both `null` and `undefined` are considered empty.
If the value is empty, [TypeError](TypeError) will be thrown.

**Kind**: static method of [<code>Optional</code>](#Optional)  
**Throws**:

- <code>TypeError</code> if given value is either `null` or `undefined`

**Template**: T  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>T</code> | value to contain |

