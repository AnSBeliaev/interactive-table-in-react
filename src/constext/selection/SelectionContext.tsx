import { createContext, type Dispatch } from 'react';

export type SelectionAction =
  { type: 'add'; id: string } | { type: 'remove'; id: string } | { type: 'set'; ids: Set<string> } | { type: 'clear' };

type SelectionContextValue = {
  anchorId: string;
  setAnchorId: React.Dispatch<React.SetStateAction<string>>;
  selectedIds: Set<string>;
  dispatch: Dispatch<SelectionAction>;
};

export const SelectionContext = createContext<SelectionContextValue | null>(null);
