# Redux-packa
[![Build Status](https://travis-ci.org/daniel-lundin/redux-packa.svg?branch=master)](https://travis-ci.org/daniel-lundin/redux-packa)
[![npm version](https://badge.fury.io/js/redux-packa.svg)](https://badge.fury.io/js/redux-packa)

Wrapper around [https://github.com/lelandrichardson/redux-pack](redux-pack) that adds hooks and handlers form canceled promises.

## Usage

Acts as a drop-in replacement for redux-pack except the middleware constructor takes a predicate function to check for cancelled promises:

```js
import { createStore, applyMiddleware } from 'redux';
import { middleware as packa } from 'redux-packa';

const cancelChecker = (reason) => reason === 'CANCELED_PROMISE';
const store = createStore(reducer, defaultState, applyMiddleware(packa(cancelChecker)));
```

Action creators can now subscribe to the onCancel-hook(or ignore it completely:

```js
export function loadFoo(id) {
  return {
    type: LOAD_FOO,
    promise: Api.getFoo(id),
    meta: {
      onSuccess: (response) => logSuccess(response)
      onCancel: (reason) => doNothing()
    },
  };
}
```

Similarly, the `handle()`-helper has an additional handler that will be called in case of canceled promises:

```js
export function fooReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_FOO:
      return handle(state, action, {
        start: prevState => ({ ...prevState, isLoading: true, error: null, foo: null }),
        finish: prevState => ({ ...prevState, isLoading: false }),
        failure: prevState => ({ ...prevState, error: payload }),
        success: prevState => ({ ...prevState, foo: payload }),
        cancel: prevState: => ({ ...prevState, isLoading: false }),
        always: prevState => prevState, // unnecessary, for the sake of example
      });
    default:
      return state;
  }
}
```


## LICENSE
MIT
