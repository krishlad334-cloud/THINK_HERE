import { createContext, useContext } from 'react';

export const AppContext = createContext(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    console.warn('useApp must be used within an AppProvider');
    return {};
  }
  return context;
}
