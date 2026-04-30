"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("@testing-library/react-native");
const App_1 = __importDefault(require("../src/App"));
test('renders welcome text', () => {
    const { getByText } = (0, react_native_1.render)(<App_1.default />);
    expect(getByText(/Welcome to Mobile App/i)).toBeTruthy();
});
