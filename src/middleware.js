/*
 * Middleware that wraps redux-pack with hooks for cancellation
 */
import {
  middleware as reduxPack
} from 'redux-pack';

import { isFunction, isPromise } from './helpers.js';

export let _cancelChecker = () => false;

function callEventHook(meta, hook, ...args) {
  if (!meta || !isFunction(meta[hook]))
    return;

  // Errors are handled by redux-pack
  meta[hook](...args);
}

const proxyMeta = (meta = {}) => ({
  onStart: (...args) => callEventHook(meta, 'onStart', ...args),
  onSuccess: (...args) => callEventHook(meta, 'onSuccess', ...args),
  onFinish: (...args) => callEventHook(meta, 'onFinish', ...args),
  onFailure: (reason) => {
    if (_cancelChecker(reason))
      return callEventHook(meta, 'onCancel', reason);
    return callEventHook(meta, 'onFailure', reason);
  }
});

const replaceMeta = (action, newMeta) => ({ ...action, meta: newMeta });

const packaMiddleware = (cancelChecker) => (store) => (next) => {
  const pack = reduxPack(store)(next);
  _cancelChecker = cancelChecker;

  return (action) => {
    if (isPromise(action.promise)) {
      return pack(replaceMeta(action, proxyMeta(action.meta)));
    }
    return next(action);
  };
};

export default packaMiddleware;
