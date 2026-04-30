"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExample = void 0;
const react_1 = require("react");
const api_1 = require("../api");
const useExample = () => {
    const [data, setData] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        (0, api_1.fetchExample)().then(setData);
    }, []);
    return data;
};
exports.useExample = useExample;
