import { createStore, applyMiddleware } from 'redux';
import { middleware as packa, handle } from '../../src';

const PROMISE_ACTION = 'PROMISE_ACTION';

const defaultState = {
  isLoading: false,
  canceled: false,
  error: null,
  data: {}
};

function rootReducer(state = defaultState, action) {
  const { payload, type } = action;
  switch(type) {
  case PROMISE_ACTION:
    return handle(state, action, {
      start: (s) => ({
        ...s,
        isLoading: true
      }),
      failure: (s) => ({
        ...s,
        isLoading: false,
        error: payload
      }),
      success: (s) => ({
        ...s,
        isLoading: false,
        data: payload
      }),
      cancel: (s) => ({
        ...s,
        isLoading: false,
        canceled: true
      })
    });
  default:
    return state;
  }
}

export function promiseAction(promise, meta = {}) {
  return {
    type: PROMISE_ACTION,
    promise,
    meta
  };
}

export function setupStore() {
  return createStore(rootReducer, defaultState, applyMiddleware(packa));
}
