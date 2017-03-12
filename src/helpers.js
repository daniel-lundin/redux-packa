export function isFunction(object) {
  return !!object && typeof object === 'function';
}

export function isPromise(obj) {
  return !!obj && isFunction(obj.then);
}
