import {renderHook, waitFor} from '@testing-library/react-native';
import {useExample} from '../../src/hooks/useExample';

jest.mock('../../src/api/index', () => ({
  fetchExample: jest.fn(async () => ({ok: true})),
}));

import {fetchExample} from '../../src/api/index';

describe('useExample', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data on mount', async () => {
    (fetchExample as jest.Mock).mockResolvedValueOnce({ok: true});

    const {result} = renderHook(() => useExample());

    await waitFor(() => {
      expect(fetchExample).toHaveBeenCalled();
    });
  });

  it('should set data after fetch', async () => {
    const mockData = {ok: true, message: 'Success'};
    (fetchExample as jest.Mock).mockResolvedValueOnce(mockData);

    const {result} = renderHook(() => useExample());

    await waitFor(() => {
      expect(result.current).toEqual(mockData);
    });
  });

  it('should handle fetch errors gracefully', async () => {
    (fetchExample as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    const {result} = renderHook(() => useExample());

    // Hook should not crash on error
    expect(result.current).toBeDefined();
  });
});
