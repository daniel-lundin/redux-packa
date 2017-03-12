import {
  handle as packHandle
} from 'redux-pack';

import { isFunction } from './helpers.js';

const callHandler = (handlers, fn, state, action) => {
  if (!handlers[fn] || !isFunction(handlers[fn]))
    return state;
  return handlers[fn](state, action);
};

const proxyHandlers = (handlers = {}) => ({
  start: (...args) => callHandler(handlers, 'start', ...args),
  success: (...args) => callHandler(handlers, 'success', ...args),
  finish: (...args) => callHandler(handlers, 'finish', ...args),
  failure: (state, action) => {
    if (action.payload === 'CANCEL_REJECTION')
      return callHandler(handlers, 'cancel', state, action);
    return callHandler(handlers, 'failure', state, action);
  }
});

export default (state, action, handlers) => packHandle(state, action, proxyHandlers(handlers));
