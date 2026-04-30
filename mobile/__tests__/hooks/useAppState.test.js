"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const useAppState_1 = require("../../src/hooks/useAppState");
const AppContext_1 = require("../../src/context/AppContext");
// Mock hook consumer component for testing
const createTestComponent = () => {
    let hookResult = null;
    const TestComponent = () => {
        hookResult = (0, useAppState_1.useAppState)();
        return null;
    };
    return { TestComponent, getResult: () => hookResult };
};
describe('useAppState', () => {
    it('should provide initial state', () => {
        const { TestComponent, getResult } = createTestComponent();
        // Wrap component render in Provider
        const component = react_1.default.createElement(AppContext_1.AppProvider, {}, react_1.default.createElement(TestComponent));
        const result = getResult();
        expect(result).not.toBeNull();
        expect(result.isLoading).toBe(false);
        expect(result.error).toBe(null);
    });
    it('should update loading state', () => {
        const { TestComponent, getResult } = createTestComponent();
        const component = react_1.default.createElement(AppContext_1.AppProvider, {}, react_1.default.createElement(TestComponent));
        const result = getResult();
        result.setLoading(true);
        expect(result.isLoading).toBe(true);
        result.setLoading(false);
        expect(result.isLoading).toBe(false);
    });
    it('should set error with message', () => {
        const { TestComponent, getResult } = createTestComponent();
        react_1.default.createElement(AppContext_1.AppProvider, {}, react_1.default.createElement(TestComponent));
        const result = getResult();
        result.showError('Test error', 400);
        expect(result.error).toEqual({
            code: 400,
            message: 'Test error',
            fieldErrors: undefined,
        });
    });
    it('should clear error', () => {
        const { TestComponent, getResult } = createTestComponent();
        react_1.default.createElement(AppContext_1.AppProvider, {}, react_1.default.createElement(TestComponent));
        const result = getResult();
        result.showError('Error', 500);
        expect(result.error).not.toBe(null);
        result.clearError();
        expect(result.error).toBe(null);
    });
    it('should throw error outside of provider', () => {
        const TestComponent = () => {
            (0, useAppState_1.useAppState)();
            return null;
        };
        expect(() => {
            TestComponent();
        }).toThrow('useAppState must be used within AppProvider');
    });
});
