
import { useContext } from 'react';
import { DataContext, DataContextType } from '@/context/data-provider';

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
