import {getProducts, createProduct, updateProduct, checkProductExists} from '../../src/api/index';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('getProducts', () => {
    it('should fetch products successfully', async () => {
      const mockData = {
        success: true,
        data: [{id: 'p1', name: 'Product 1', description: 'Desc', logo: 'logo.png', date_release: '2024-01-01', date_revision: '2025-01-01'}],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await getProducts();

      expect(result).toEqual(mockData.data);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/products');
    });

    it('should throw on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({error: {message: 'Server error'}}),
      } as Response);

      await expect(getProducts()).rejects.toThrow('Server error');
    });
  });

  describe('checkProductExists', () => {
    it('should return true if product exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({success: true, data: {exists: true}}),
      } as Response);

      const result = await checkProductExists('p1');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/products/p1/verify');
    });

    it('should return false if product does not exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({success: true, data: {exists: false}}),
      } as Response);

      const result = await checkProductExists('p999');

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response);

      const result = await checkProductExists('p1');

      expect(result).toBe(false);
    });
  });

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      const payload = {id: 'p1', name: 'New Product', description: 'Desc', logo: 'logo.png', date_release: '2024-01-01', date_revision: '2025-01-01'};
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({success: true, data: payload}),
      } as Response);

      const result = await createProduct(payload);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/products', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
    });

    it('should throw on validation error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({error: {message: 'Duplicate identifier found'}}),
      } as Response);

      await expect(createProduct({})).rejects.toThrow('Duplicate identifier found');
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const payload = {name: 'Updated'};
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({success: true, data: payload}),
      } as Response);

      const result = await updateProduct('p1', payload);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/products/p1', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
    });

    it('should throw on 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({error: {message: 'Not found'}}),
      } as Response);

      await expect(updateProduct('p999', {})).rejects.toThrow('Not found');
    });
  });
});
