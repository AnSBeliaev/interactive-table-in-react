import { createContext, type Dispatch } from 'react';

export type SelectionAction = { type: 'add'; id: string } | { type: 'remove'; id: string };

type SelectionContextValue = {
  selectedIds: Set<string>;
  dispatch: Dispatch<SelectionAction>;
};

export const SelectionContext = createContext<SelectionContextValue | null>(null);
