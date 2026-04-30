"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapApiError = exports.getErrorMessage = exports.ERROR_MESSAGES = void 0;
exports.ERROR_MESSAGES = {
    400: 'Invalid request. Please check your input.',
    404: 'Resource not found.',
    500: 'Server error. Please try again later.',
    'NETWORK_ERROR': 'Network error. Please check your connection.',
    'VALIDATION_ERROR': 'Please fix the errors below.',
    'DUPLICATE_ID': 'This ID already exists.',
    'INVALID_DATE': 'Please enter a valid date.',
};
const getErrorMessage = (code) => {
    if (!code)
        return 'An error occurred.';
    return exports.ERROR_MESSAGES[code] || `Error: ${code}`;
};
exports.getErrorMessage = getErrorMessage;
const mapApiError = (error) => {
    var _a;
    if (!error)
        return { code: 500, message: (0, exports.getErrorMessage)(500) };
    const status = (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.httpCode) || 500;
    const apiMsg = ((_a = error === null || error === void 0 ? void 0 : error.error) === null || _a === void 0 ? void 0 : _a.message) || (error === null || error === void 0 ? void 0 : error.message);
    let msg = (0, exports.getErrorMessage)(status);
    // detect specific errors
    if (apiMsg === null || apiMsg === void 0 ? void 0 : apiMsg.toLowerCase().includes('duplicate')) {
        msg = (0, exports.getErrorMessage)('DUPLICATE_ID');
    }
    else if (apiMsg === null || apiMsg === void 0 ? void 0 : apiMsg.toLowerCase().includes('not found')) {
        msg = (0, exports.getErrorMessage)(404);
    }
    else if (apiMsg) {
        msg = apiMsg;
    }
    return { code: status, message: msg };
};
exports.mapApiError = mapApiError;
