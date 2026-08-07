import { useContext } from 'react';
import { SelectionContext } from './SelectionContext';

export const useSelection = () => {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within SelectionProvider');
  return ctx;
};
