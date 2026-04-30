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
const index_1 = require("../../src/api/index");
const mockFetch = global.fetch;
describe('API', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });
    describe('getProducts', () => {
        it('should fetch products successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = {
                success: true,
                data: [{ id: 'p1', name: 'Product 1', description: 'Desc', logo: 'logo.png', date_release: '2024-01-01', date_revision: '2025-01-01' }],
            };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => __awaiter(void 0, void 0, void 0, function* () { return mockData; }),
            });
            const result = yield (0, index_1.getProducts)();
            expect(result).toEqual(mockData.data);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/products');
        }));
        it('should throw on HTTP error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ error: { message: 'Server error' } }); }),
            });
            yield expect((0, index_1.getProducts)()).rejects.toThrow('Server error');
        }));
    });
    describe('checkProductExists', () => {
        it('should return true if product exists', () => __awaiter(void 0, void 0, void 0, function* () {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ success: true, data: { exists: true } }); }),
            });
            const result = yield (0, index_1.checkProductExists)('p1');
            expect(result).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/products/p1/verify');
        }));
        it('should return false if product does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ success: true, data: { exists: false } }); }),
            });
            const result = yield (0, index_1.checkProductExists)('p999');
            expect(result).toBe(false);
        }));
        it('should return false on error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: () => __awaiter(void 0, void 0, void 0, function* () { return ({}); }),
            });
            const result = yield (0, index_1.checkProductExists)('p1');
            expect(result).toBe(false);
        }));
    });
    describe('createProduct', () => {
        it('should create product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { id: 'p1', name: 'New Product', description: 'Desc', logo: 'logo.png', date_release: '2024-01-01', date_revision: '2025-01-01' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ success: true, data: payload }); }),
            });
            const result = yield (0, index_1.createProduct)(payload);
            expect(result.success).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        }));
        it('should throw on validation error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ error: { message: 'Duplicate identifier found' } }); }),
            });
            yield expect((0, index_1.createProduct)({})).rejects.toThrow('Duplicate identifier found');
        }));
    });
    describe('updateProduct', () => {
        it('should update product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { name: 'Updated' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ success: true, data: payload }); }),
            });
            const result = yield (0, index_1.updateProduct)('p1', payload);
            expect(result.success).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/products/p1', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        }));
        it('should throw on 404', () => __awaiter(void 0, void 0, void 0, function* () {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ error: { message: 'Not found' } }); }),
            });
            yield expect((0, index_1.updateProduct)('p999', {})).rejects.toThrow('Not found');
        }));
    });
});
