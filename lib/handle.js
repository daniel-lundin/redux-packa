'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handle = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxPack = require('redux-pack');

var handle = exports.handle = function handle(state, action, handlers) {
  var meta = action.meta;

  if (!meta || !meta[_reduxPack.KEY.LIFECYCLE]) {
    // Let redux-pack handle errors
    return (0, _reduxPack.handle)(state, action, handlers);
  }

  var isFailure = meta[_reduxPack.KEY.LIFECYCLE] === _reduxPack.LIFECYCLE.FAILURE;
  if (isFailure && action.payload === 'CANCEL_REJECTION') {
    var fakeHandlers = _extends({}, handlers, {
      failure: handlers.cancel
    });
    return (0, _reduxPack.handle)(state, action, fakeHandlers);
  }
  return (0, _reduxPack.handle)(state, action, handlers);
};