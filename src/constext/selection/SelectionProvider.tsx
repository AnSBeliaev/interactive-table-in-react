import { useReducer, type ReactNode } from 'react';
import { SelectionContext } from './SelectionContext';
import { selectionReducer } from './selectionReducer';

type SelectionProviderProps = {
  children: ReactNode;
};

export const SelectionProvider = ({ children }: SelectionProviderProps) => {
  const initialSelectedIds = new Set<string>();
  const [selectedIds, dispatch] = useReducer(selectionReducer, initialSelectedIds);
  console.log('selectedIds: >>>', selectedIds);
  return <SelectionContext.Provider value={{ selectedIds, dispatch }}>{children}</SelectionContext.Provider>;
};
