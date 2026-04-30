"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.createProduct = exports.checkProductExists = exports.fetchExample = exports.getProducts = void 0;
const BASE = 'http://localhost:3002';
const handleResponse = (res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const json = yield res.json();
    if (!res.ok) {
        const error = new Error(((_a = json === null || json === void 0 ? void 0 : json.error) === null || _a === void 0 ? void 0 : _a.message) || `HTTP ${res.status}`);
        error.status = res.status;
        error.data = json;
        throw error;
    }
    return json;
});
const getProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const res = yield fetch(`${BASE}/products`);
        const json = yield handleResponse(res);
        return (_b = json === null || json === void 0 ? void 0 : json.data) !== null && _b !== void 0 ? _b : [];
    }
    catch (err) {
        console.warn('getProducts error', err);
        throw err;
    }
});
exports.getProducts = getProducts;
const fetchExample = () => __awaiter(void 0, void 0, void 0, function* () {
    return { ok: true };
});
exports.fetchExample = fetchExample;
const checkProductExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const res = yield fetch(`${BASE}/products/${encodeURIComponent(id)}/verify`);
        const json = yield handleResponse(res);
        return !!((_c = json === null || json === void 0 ? void 0 : json.data) === null || _c === void 0 ? void 0 : _c.exists);
    }
    catch (err) {
        console.warn('checkProductExists error', err);
        return false;
    }
});
exports.checkProductExists = checkProductExists;
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const json = yield handleResponse(res);
        return json;
    }
    catch (err) {
        console.warn('createProduct error', err);
        throw err;
    }
});
exports.createProduct = createProduct;
const updateProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${BASE}/products/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const json = yield handleResponse(res);
        return json;
    }
    catch (err) {
        console.warn('updateProduct error', err);
        throw err;
    }
});
exports.updateProduct = updateProduct;
