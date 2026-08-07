import { createContext, type Dispatch, type SetStateAction } from 'react';

export type SelectionAction =
  { type: 'add'; id: string } | { type: 'remove'; id: string } | { type: 'set'; ids: Set<string> };

type SelectionContextValue = {
  anchorId: string;
  setAnchorId: React.Dispatch<React.SetStateAction<string>>;
  selectedIds: Set<string>;
  dispatch: Dispatch<SelectionAction>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<SetStateAction<boolean>>;
};

export const SelectionContext = createContext<SelectionContextValue | null>(null);
