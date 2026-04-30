"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const log = (...args) => {
    // small wrapper for logs
    // eslint-disable-next-line no-console
    console.log(...args);
};
exports.log = log;
