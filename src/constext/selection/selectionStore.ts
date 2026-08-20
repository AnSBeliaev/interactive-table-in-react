import type { SetStateAction } from 'react';
import { selectionReducer } from './selectionReducer';
import type { SelectionAction } from '../../components/Table/types';

export type SelectionState = {
  selectedIds: Set<string>;
  anchorId: string;
  isDragging: boolean;
  statsSelectedIds: Set<string>;
};

let state: SelectionState = {
  selectedIds: new Set<string>(),
  anchorId: '',
  isDragging: false,
  statsSelectedIds: new Set<string>(),
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
      statsSelectedIds: state.isDragging ? state.statsSelectedIds : selectedIds,
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

  setDragging: (isDragging: boolean) => {
    if (state.isDragging === isDragging) return;
    state = {
      ...state,
      isDragging,
      statsSelectedIds: isDragging ? state.statsSelectedIds : state.selectedIds,
    };
    emit();
  },
};
