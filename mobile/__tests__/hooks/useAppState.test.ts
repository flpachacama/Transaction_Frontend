import {renderHook, act} from '@testing-library/react-native';
import {useAppState} from '../../src/hooks/useAppState';
import {AppProvider} from '../../src/context/AppContext';

describe('useAppState', () => {
  const wrapper = ({children}: any) => <AppProvider>{children}</AppProvider>;

  it('should provide initial state', () => {
    const {result} = renderHook(() => useAppState(), {wrapper});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should update loading state', () => {
    const {result} = renderHook(() => useAppState(), {wrapper});

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should set error with message', () => {
    const {result} = renderHook(() => useAppState(), {wrapper});

    act(() => {
      result.current.showError('Test error', 400);
    });

    expect(result.current.error).toEqual({
      code: 400,
      message: 'Test error',
      fieldErrors: undefined,
    });
  });

  it('should set error with field errors', () => {
    const {result} = renderHook(() => useAppState(), {wrapper});
    const fieldErrors = {name: 'Name is required', email: 'Invalid email'};

    act(() => {
      result.current.showError('Validation error', 400, fieldErrors);
    });

    expect(result.current.error?.fieldErrors).toEqual(fieldErrors);
  });

  it('should clear error', () => {
    const {result} = renderHook(() => useAppState(), {wrapper});

    act(() => {
      result.current.showError('Error', 500);
    });

    expect(result.current.error).not.toBe(null);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('should set error directly', () => {
    const {result} = renderHook(() => useAppState(), {wrapper});
    const error = {code: 404, message: 'Not found'};

    act(() => {
      result.current.setError(error);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should throw error outside of provider', () => {
    expect(() => {
      renderHook(() => useAppState());
    }).toThrow('useAppState must be used within AppProvider');
  });
});
