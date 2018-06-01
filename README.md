# async-optional

[![Build Status](https://travis-ci.org/treble-snake/async-optional.svg?branch=master)](https://travis-ci.org/treble-snake/async-optional)
[![Coverage Status](https://coveralls.io/repos/github/treble-snake/async-optional/badge.svg?branch=master)](https://coveralls.io/github/treble-snake/async-optional?branch=master)

## About

This library implements generic NullObject to help you write cleaner code in more unconditional way and get rid of endless null-checks. It's very similar to Java Optional class or safe navigation ability in some languages.

 
Inspired by [Java Optional](https://docs.oracle.com/javase/9/docs/api/java/util/Optional.html) and [Optional.js](https://github.com/JasonStorey/Optional.js) implementation.

Compare these examples:

* conditional style
```js
function getUserData() {
  const user = getUser();
  if(user === null || !user.isActive) {
    return null;
  }
  
  Object.assign(user, {
    friends: getFriends(user)
  });
  
  return user;
}

const userData = getUserData();
if(userData !== null) {
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
    .map(user => Object.assign(user, {friends: getFriends(user)}))
}

getUserData()
  .either(respond)
  .or(respondNotFound);
```

Of course, [Optional.js](https://github.com/JasonStorey/Optional.js) can do all of this. But now you can use `AsyncOptional` and work with asynchronous values and callbacks and just add couple of fancy `await`s (or use `then/catch` if you have to).  

Just like that:
```js
function getUserData() {
  // let's say getUser() returns Promise
  return AsyncOptional.with(getUser())
    .filter(user => user.isActive)
    .map(async user => Object.assign(user, {friends: await getFriends(user)}))
}

await getUserData()
  .either(respond)
  .or(respondNotFound);
```

## Installation
```
npm install async-optional
```

Supports Node.js 6 or newer.

## Usage
There are some usage examples of AsyncOptional. Case for Optional will be the same except no `await` needed.

Most common case. Fetch data, modify it and do some stuff with it if it exists and is valid:

```js
await AsyncOptional.with(fetchData())
  .map(data => doSomething(data))
  .filter(data => isValid(data))
  .map(doSomethingElse)
  .ifPresent(data => consumeData(data));

```

You can react only if there is no data:
```js
await AsyncOptional.with(fetchData())
  .map(addSomething)
  .filter(checkData)
  .ifEmpty(handleAbsence);

```
Or you can do both within 1 call (or chain like in an example above):
```js
await AsyncOptional.with(fetchData())
  .map(addSomething)
  .filter(checkData)
  .eitherOr(handlePresentedData, handleDataAbsence);

```
You can fetch from more than one source (sequentially). 

Mention those `or()` arguments are functions to be lazy called if previous value supplier fails: 
```js
await AsyncOptional
  .with(fetchFromOneSource())
  .orUse(anotherValue)
  .orCompute(fetchFromAnotherSource)
  .orFlatCompute(fetchFromThirdSourceAsOptional)
  .either(handlePresentedData)
  .or(handleDataAbsence);

```

## Further reading: TBD
Here are some [generated API docs](https://treble-snake.github.io/async-optional/).

## License

MIT License