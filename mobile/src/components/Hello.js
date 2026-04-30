"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const Hello = ({ name }) => {
    return <react_native_1.Text>Hello, {name}!</react_native_1.Text>;
};
exports.default = Hello;
