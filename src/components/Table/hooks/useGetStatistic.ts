import { useMemo } from 'react';
import { getRowAndColumnIds } from '../helpers';

export const useGetStatistic = (selectedIds: Set<string>) => {
  const { selectedCells, selectedRows, selectedColumns } = useMemo(() => {
    const selectedCells = new Set<string>();
    const selectedRows = new Set<string>();
    const selectedColumns = new Set<string>();

    selectedIds.forEach((id) => {
      const { columnId, rowId } = getRowAndColumnIds(id);
      if (columnId == null) return;

      const isNumericColumn = !isNaN(Number(columnId));
      const isNumericRow = !isNaN(Number(rowId));

      if (isNumericColumn && isNumericRow) {
        selectedCells.add(id);
        return;
      }

      if (isNumericRow) {
        console.log('id: >>>', id);
        selectedRows.add(String(rowId));
        return;
      }

      if (isNumericColumn) {
        selectedColumns.add(String(columnId));
      }
    });

    return { selectedCells, selectedRows, selectedColumns };
  }, [selectedIds]);

  return { selectedCells, selectedRows, selectedColumns };
};
