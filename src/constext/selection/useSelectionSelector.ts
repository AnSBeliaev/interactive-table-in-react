import { useSyncExternalStore } from 'react';
import { selectionStore, type SelectionState } from './selectionStore';

export const useSelectionSelector = <T>(selector: (state: SelectionState) => T) => {
  return useSyncExternalStore(selectionStore.subscribe, () => selector(selectionStore.getState()));
};
