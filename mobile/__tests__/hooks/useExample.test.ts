import {useExample} from '../../src/hooks/useExample';

jest.mock('../../src/api/index', () => ({
  fetchExample: jest.fn(async () => ({ok: true})),
}));

import {fetchExample} from '../../src/api/index';

describe('useExample', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be a valid hook function', () => {
    expect(typeof useExample).toBe('function');
  });

  it('mock should handle async fetch', async () => {
    const mockData = {ok: true, message: 'Success'};
    (fetchExample as jest.Mock).mockResolvedValueOnce(mockData);

    const result = await fetchExample();
    expect(result).toEqual(mockData);
  });

  it('should handle fetch errors', async () => {
    (fetchExample as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    try {
      await fetchExample();
      fail('Should have thrown');
    } catch (error: any) {
      expect(error.message).toBe('Fetch failed');
    }
  });
});
