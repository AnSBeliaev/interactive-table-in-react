import { useMemo } from 'react';

export const useGetSelectedIdsByRow = (selectedIds: Set<string>) => {
  const selectedCellIdsByRow = useMemo(() => {
    const byRow = new Map<number, Set<string>>();
    selectedIds.forEach((cellId) => {
      const sep = cellId.lastIndexOf('-');
      if (sep === -1) return;
      const rowId = Number(cellId.slice(sep + 1));
      if (!Number.isFinite(rowId)) return;
      const rowSet = byRow.get(rowId) ?? new Set<string>();
      rowSet.add(cellId);
      byRow.set(rowId, rowSet);
    });
    return byRow;
  }, [selectedIds]);
  return selectedCellIdsByRow;
};
