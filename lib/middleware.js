'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.packaMiddleware = exports.handle = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   * Middleware that wraps redux-pack with hooks for cancellation
                                                                                                                                                                                                                                                                   */


var _reduxPack = require('redux-pack');

function isFunction(object) {
    return !!object && typeof object === 'function';
}

function isPromise(obj) {
    return !!obj && isFunction(obj.then);
}

var redirectFailureToCancel = function redirectFailureToCancel() {
    var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // Not really right, should create a onFailure to be able to
    // catch cancellations, TODO
    if (!isFunction(meta.onFailure)) {
        return meta;
    }

    var oldFailure = meta.onFailure;
    var newFailure = function newFailure(reason) {
        if (reason !== 'CANCEL_REJECTION') {
            if (isFunction(oldFailure)) {
                oldFailure(reason);
            }
        }
        if (isFunction(meta.onCancel)) {
            meta.onCancel(reason);
        }
    };
    return _extends({}, meta, { onFailure: newFailure });
};

var replaceMeta = function replaceMeta(action, newMeta) {
    return _extends({}, action, { meta: newMeta });
};

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

var packaMiddleware = exports.packaMiddleware = function packaMiddleware(store) {
    return function (next) {
        var pack = (0, _reduxPack.middleware)(store)(next);

        return function (action) {
            if (isPromise(action.promise)) {
                return pack(replaceMeta(action, redirectFailureToCancel(action.meta)));
            }
            return next(action);
        };
    };
};