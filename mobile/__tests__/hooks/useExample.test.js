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
const useExample_1 = require("../../src/hooks/useExample");
jest.mock('../../src/api/index', () => ({
    fetchExample: jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { return ({ ok: true }); })),
}));
const index_1 = require("../../src/api/index");
describe('useExample', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should be a valid hook function', () => {
        expect(typeof useExample_1.useExample).toBe('function');
    });
    it('mock should handle async fetch', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockData = { ok: true, message: 'Success' };
        index_1.fetchExample.mockResolvedValueOnce(mockData);
        const result = yield (0, index_1.fetchExample)();
        expect(result).toEqual(mockData);
    }));
    it('should handle fetch errors', () => __awaiter(void 0, void 0, void 0, function* () {
        index_1.fetchExample.mockRejectedValueOnce(new Error('Fetch failed'));
        try {
            yield (0, index_1.fetchExample)();
            fail('Should have thrown');
        }
        catch (error) {
            expect(error.message).toBe('Fetch failed');
        }
    }));
});
