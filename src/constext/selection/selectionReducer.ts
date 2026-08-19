export type SelectionAction =
  { type: 'add'; id: string } | { type: 'remove'; id: string } | { type: 'set'; ids: Set<string> } | { type: 'clear' };

export const selectionReducer = (selectedIds: Set<string>, action: SelectionAction) => {
  const actionType = action.type;
  switch (action.type) {
    case 'add': {
      const newSelectedIds = new Set(selectedIds);
      newSelectedIds.add(action.id);
      return newSelectedIds;
    }
    case 'remove': {
      const newSelectedIds = new Set(selectedIds);
      newSelectedIds.delete(action.id);
      return newSelectedIds;
    }
    case 'set': {
      const newSelectedIds = new Set(action.ids);
      return newSelectedIds;
    }
    case 'clear': {
      const newSelectedIds = new Set<string>();
      return newSelectedIds;
    }
    default: {
      throw Error(`Unknown action: ${actionType}`);
    }
  }
};
