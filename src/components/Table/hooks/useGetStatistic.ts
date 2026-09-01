import { useMemo } from 'react';
import { getRowAndColumnIds } from '../helpers';

type UseGetStatisticArgs = {
  selectedIds: Set<string>;
  isSelectAll?: boolean;
  totalRows?: number;
  totalColumns?: number;
};

export const useGetStatistic = ({ selectedIds, isSelectAll, totalRows = 0, totalColumns = 0 }: UseGetStatisticArgs) => {
  const { selectedCells, selectedRows, selectedColumns } = useMemo(() => {
    if (isSelectAll) {
      return {
        selectedCells: { size: totalRows * totalColumns },
        selectedRows: { size: totalRows },
        selectedColumns: { size: totalColumns },
      };
    }

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
        selectedRows.add(String(rowId));
        return;
      }

      if (isNumericColumn) {
        selectedColumns.add(String(columnId));
      }
    });

    return { selectedCells, selectedRows, selectedColumns };
  }, [selectedIds, isSelectAll, totalRows, totalColumns]);

  return { selectedCells, selectedRows, selectedColumns };
};
