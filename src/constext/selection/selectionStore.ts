import type { Dispatch, SetStateAction } from 'react';
import { selectionReducer } from './selectionReducer';

export type SelectionState = {
  selectedIds: Set<string>;
  anchorId: string;
};

export type SelectionAction =
  { type: 'add'; id: string } | { type: 'remove'; id: string } | { type: 'set'; ids: Set<string> } | { type: 'clear' };

class SelectionStore {
  private state: SelectionState = {
    selectedIds: new Set<string>(),
    anchorId: '',
  };

  private listeners = new Set<() => void>();

  getState = () => {
    return this.state;
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  dispatch: Dispatch<SelectionAction> = (action) => {
    const selectedIds = selectionReducer(this.state.selectedIds, action);

    this.state = {
      ...this.state,
      selectedIds,
    };

    this.emit();
  };

  setAnchorId = (value: SetStateAction<string>) => {
    const anchorId = typeof value === 'function' ? value(this.state.anchorId) : value;

    if (anchorId === this.state.anchorId) {
      return;
    }

    this.state = {
      ...this.state,
      anchorId,
    };

    this.emit();
  };

  private emit = () => {
    this.listeners.forEach((listener) => listener());
  };
}

export const selectionStore = new SelectionStore();
