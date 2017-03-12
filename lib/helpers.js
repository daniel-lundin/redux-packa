'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isFunction = isFunction;
exports.isPromise = isPromise;
function isFunction(object) {
    return !!object && typeof object === 'function';
}

function isPromise(obj) {
    return !!obj && isFunction(obj.then);
}