# async-optional

[![Build Status](https://travis-ci.org/treble-snake/async-optional.svg?branch=master)](https://travis-ci.org/treble-snake/async-optional)
[![Coverage Status](https://coveralls.io/repos/github/treble-snake/async-optional/badge.svg?branch=master)](https://coveralls.io/github/treble-snake/async-optional?branch=master)

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [AsyncOptional notes](#asyncoptional-notes)
- [Further reading](#further-reading)
- [Changelog](https://github.com/treble-snake/async-optional/releases)
- [License](#license)

## About

This library implements generic value container with fluent API to help you write 
cleaner code in more unconditional way and get rid of endless null-checks. 
It's very similar to Java Optional class and provides some safe navigation abilities. 
And, most important thing — it works with Promises.

 
Inspired by [Java Optional](https://docs.oracle.com/javase/9/docs/api/java/util/Optional.html) 
and [Optional.js](https://github.com/JasonStorey/Optional.js) implementation.

Compare these examples:

* conditional style
```js
function getUserData() {
  const user = getUser();
  if (user === null || !user.isActive) {
    return null;
  }
  
  Object.assign(user, { friends: getFriends(user) });
  
  return user;
}

const userData = getUserData();
if (userData !== null) {
  respond(userData)
} else {
  respondNotFound();
}
```

* unconditional style
```js
function getUserData() {
  return Optional.with(getUser())
    .filter(user => user.isActive)
    .map(user => Object.assign(user, { friends: getFriends(user) }))
}

getUserData()
  .either(respond)
  .or(respondNotFound);
```

Of course, [Optional.js](https://github.com/JasonStorey/Optional.js) can do 
all of this. But now you can use `AsyncOptional` and work with asynchronous 
values and callbacks and just add couple of fancy `await`s (or use `then/catch` 
if you have to).  

Just like that:
```js
function getUserData() {
  // let's say getUser() returns Promise
  return AsyncOptional.with(getUser())
    .filter(user => user.isActive)
    .map(async (user) => Object.assign(user, {friends: await getFriends(user)}))
}

await getUserData()
  .either(respond)
  .or(respondNotFound);
```

Other than fact, that AsyncOptional works with Promises 
(so can take arguments and return values regarding), 
[Optional](https://github.com/treble-snake/async-optional/blob/master/docs/APIDOC.md#Optional) 
and [AsyncOptional](https://github.com/treble-snake/async-optional/blob/master/docs/APIDOC.md#AsyncOptional) 
APIs are identical.

## Installation
```
npm install async-optional
```

```js
const {AsyncOptional, Optional} = require('async-optional');
```

Supports Node.js 6 or newer.

## Usage
There are some usage examples of AsyncOptional. Case for Optional will be 
the same except no `await` needed.

### Create it
There are 3 ways of creating an Optional instance:
```js
// directly via construtor 
const instance = new AsyncOptional(getSomeNullableData());

// via .with() method, accepting empty (`null` and `undefined`) values
const instance = AsyncOptional.with(getSomeNullableData());
 
// via .withEnsured method, rejecting empty (`null` and `undefined`) values
const instance = AsyncOptional.withEnsured(getSomeNonNullableData());

// all these getSome...() methods could return Promise
```

And if you have a need of explicitly creating an empty optional, you can use `.empty()` method:
```js
const instance = AsyncOptional.empty();
```

### Transform it

Then you can do a bunch of transformations with you data via fluent API:
```js
const instance = AsyncOptional.with(getSomeData())
   // value to use if current is empty
  .orUse(42)
  // function to generate new value if current is empty
  .orCompute(() => { return produceSomeValue(42); })
  // function to get new optional if current value is empty
  .orFlatCompute(() => AsyncOptional.with(getAnotherData()))
  // take property with name `foo` from current data
  .take('foo')
  // change the value somehow
  .map(value => value + getDiff(value))
  // modify it more, using another AsyncOptional
  .flatMap(value => AsyncOptional.with(maybeGetData(value)))
  // check if it's valid 
  .filter(value => value > 10) 
  // and modify it further
  .map(value => Object.assign({}, someBase, {value})); 
```

All callbacks can be asynchronous (returning Promise) and are lazy-executed,
meaning that if current value is empty, none of `take()`, `map()`, `flatMap()` and `filter()`
callback will be executed.
And vise versa, if current value is present, `orCompute()` and `orFlatCompute()`
callbacks won't run.

### Use it

And finally, you can do something with resulting data (or without it).
There are 2 ways (in general) of doing that.

#### Cool way
Preferred way is using abilities provided by fluent API and staying cool and unconditional.

And the coolest among them is using either/or pair (if you need to react on both
presence and absence of the value):
```js
await AsyncOptional.with(getSomeData())
  // ... do some transofrmations and then:
  .either(value => respond(value))
  .or(() => respondNotFound());

```

If you need to react only on one of the events, you can do it too:
```js
await AsyncOptional.with(getSomeData())
  .ifPresent(doSomething);

await AsyncOptional.with(getSomeData())
  .ifAbsent(screamInPanic);

```

Bonus (for fans of the approach) — you can pass both callbacks at once:
```js
await AsyncOptional.with(getSomeData())
  .eitherOr(
    value => respond(value),
    () => respondNotFound() // 2nd argument can be omitted, btw
  );
```

#### Another way

It's kinda violation of the whole zen, but still can be the case. You can 
check presence of your value and get it unwrapped to use for some purpose.
```js
const instance = AsyncOptional.with(getSomeData());

if (await instance.hasValue()) {
  doSomethingWithValue(await instance.get());
} else {
  // some action on absence of value
}

// or just react on absence
if (await instance.isEmpty()) {
  printSomeError();
}
``` 

Once again, this is not the recommended way to do it.

## AsyncOptional notes
### Performance tips
Using Promises comes with a price — `AsyncOptional` works slower than `Optional`. 
So if you don't need any async values or callbacks — better use `Optional`.

Also, if you have both sync and async callbacks, putting async ones as late 
in the chain as you can might give you a slight performance boost. E.g.:
```js
// this is slower
await AsyncOptional.with(42)
  .map(async (value) => value + (await getModifier()))
  .map(value => value - 2)
  .map(value => value + 4)
  .map(value => value + 8)
  .either(print)
  .or(logError);
  
// this is faster
await AsyncOptional.with(42)
  .map(value => value - 2)
  .map(value => value + 4)
  .map(value => value + 8)
  .map(async (value) => value + (await getModifier()))
  .either(print)
  .or(logError);
```

### Error handling
AsyncOptional respects fail fast principle. When the value is not Promise-like,
it will throw an error as soon as it can, not waiting for `.then()` or `.catch()`
or `await`:
```js
const instance = AsyncOptional.with(42)
  .map(value => { throw new Error('Fail fast!') })
  // you'll get the Error there, further code won't execute
  .filter(predicate());
```

But with async values we can't fail until Promise is resolved, so:
```js
const asyncAtOnce = AsyncOptional.with(Promise.resolve(42))
  .map(value => { throw new Error('Fail on promise') })
  .filter(() => false);

const asyncByCallback = AsyncOptional.with(42)
  .filter(async (value) => value > (await Promise.resolve(1)))
  .map(value => { throw new Error('Fail on promise') });

// still no error

try {
  await asyncAtOnce.get();
} catch (e) {
  // and now you got it
  console.warn(e);
  // => Error: Fail on promise
}

// or this way
asyncByCallback
  .get()
  .catch(e => {
    console.warn(e);
    // => Error: Fail on promise
  });
```

## Further reading
Here is complete [API doc](https://github.com/treble-snake/async-optional/blob/master/docs/APIDOC.md).

## License

MIT License
