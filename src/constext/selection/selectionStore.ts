import type { SetStateAction } from 'react';
import { selectionReducer } from './selectionReducer';
import type { SelectionAction } from '../../components/Table/types';

export type SelectionState = {
  selectedIds: Set<string>;
  anchorId: string;
};

let state: SelectionState = {
  selectedIds: new Set<string>(),
  anchorId: '',
};

const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

export const selectionStore = {
  getState: () => state,

  subscribe: (listener: () => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  dispatch: (action: SelectionAction) => {
    const selectedIds = selectionReducer(state.selectedIds, action);

    state = {
      ...state,
      selectedIds,
    };

    emit();
  },

  setAnchorId: (value: SetStateAction<string>) => {
    const anchorId = typeof value === 'function' ? value(state.anchorId) : value;

    if (anchorId === state.anchorId) {
      return;
    }

    state = {
      ...state,
      anchorId,
    };

    emit();
  },
};
