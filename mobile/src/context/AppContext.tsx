import React, {createContext, useState, useCallback, ReactNode} from 'react';

export type AppError = {
  code: number;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type AppContextType = {
  isLoading: boolean;
  error: AppError | null;
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  showError: (message: string, code?: number, fieldErrors?: Record<string, string>) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AppProvider: React.FC<Props> = ({children}) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const showError = useCallback(
    (message: string, code: number = 500, fieldErrors?: Record<string, string>) => {
      setError({code, message, fieldErrors});
    },
    [],
  );

  const value: AppContextType = {
    isLoading,
    error,
    setLoading,
    setError,
    clearError,
    showError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
