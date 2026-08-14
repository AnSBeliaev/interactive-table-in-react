import { useMemo } from 'react';
import { getRowAndColumnIds } from '../helpers';

export const useGetSelectedIdsByRow = (selectedIds: Set<string>) => {
  const selectedCellIdsByRow = useMemo(() => {
    const cellsByRow = new Map<number, Set<string>>();

    selectedIds.forEach((cellId) => {
      const { rowId } = getRowAndColumnIds(cellId);
      if (!Number.isFinite(rowId) || !rowId) return;
      const rowSet = cellsByRow.get(rowId) ?? new Set<string>();
      rowSet.add(cellId);
      cellsByRow.set(rowId, rowSet);
    });

    return cellsByRow;
  }, [selectedIds]);
  return selectedCellIdsByRow;
};
