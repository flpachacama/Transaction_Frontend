"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppState = void 0;
const react_1 = require("react");
const AppContext_1 = require("../context/AppContext");
const useAppState = () => {
    const context = (0, react_1.useContext)(AppContext_1.AppContext);
    if (!context) {
        throw new Error('useAppState must be used within AppProvider');
    }
    return context;
};
exports.useAppState = useAppState;
