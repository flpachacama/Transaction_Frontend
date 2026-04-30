import {ERROR_MESSAGES, getErrorMessage, mapApiError} from '../../src/utils/errorMessages';

describe('errorMessages', () => {
  describe('getErrorMessage', () => {
    it('should return message for known error code', () => {
      expect(getErrorMessage(400)).toBe('Invalid request. Please check your input.');
      expect(getErrorMessage(404)).toBe('Resource not found.');
      expect(getErrorMessage(500)).toBe('Server error. Please try again later.');
    });

    it('should return message for custom codes', () => {
      expect(getErrorMessage('NETWORK_ERROR')).toBe('Network error. Please check your connection.');
      expect(getErrorMessage('DUPLICATE_ID')).toBe('This ID already exists.');
    });

    it('should return generic message for unknown code', () => {
      expect(getErrorMessage(999)).toContain('Error: 999');
    });

    it('should return generic message when code is null/undefined', () => {
      expect(getErrorMessage()).toBe('An error occurred.');
      expect(getErrorMessage(null as any)).toBe('An error occurred.');
    });
  });

  describe('mapApiError', () => {
    it('should map 400 error', () => {
      const error = {status: 400, error: {message: 'Bad request'}};
      const result = mapApiError(error);
      expect(result.code).toBe(400);
      expect(result.message).toBe('Invalid request. Please check your input.');
    });

    it('should map 404 error', () => {
      const error = {status: 404, error: {message: 'Not found'}};
      const result = mapApiError(error);
      expect(result.code).toBe(404);
    });

    it('should map duplicate error', () => {
      const error = {status: 400, error: {message: 'Duplicate identifier found'}};
      const result = mapApiError(error);
      expect(result.message).toContain('ID already exists');
    });

    it('should use custom API message if available', () => {
      const error = {status: 400, error: {message: 'Custom validation error'}};
      const result = mapApiError(error);
      expect(result.message).toBe('Custom validation error');
    });

    it('should default to 500 for null error', () => {
      const result = mapApiError(null);
      expect(result.code).toBe(500);
      expect(result.message).toBe('Server error. Please try again later.');
    });
  });
});
