import {useContext} from 'react';
import {AppContext, AppContextType} from '../context/AppContext';

export const useAppState = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
};
