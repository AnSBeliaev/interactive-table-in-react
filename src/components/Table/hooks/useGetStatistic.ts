import { useMemo } from 'react';
import { getRowAndColumnIds } from '../helpers';

export const useGetStatistic = (selectedIds: Set<string>) => {
  const { selectedCells, selectedRows, selectedColumns } = useMemo(() => {
    const selectedCells = new Set(
      [...selectedIds].filter((id) => {
        const { columnId, rowId } = getRowAndColumnIds(id);
        return !isNaN(Number(columnId)) && !isNaN(Number(rowId));
      }),
    );

    const selectedRows = new Set(
      [...selectedIds].reduce((ids: string[], currentId) => {
        const { rowId } = getRowAndColumnIds(currentId);
        if (!isNaN(Number(rowId)) && !ids.includes(String(rowId))) {
          ids.push(String(rowId));
        }
        return ids;
      }, []),
    );

    const selectedColumns = new Set(
      [...selectedIds].reduce((ids: string[], currentId) => {
        const { columnId } = getRowAndColumnIds(currentId);
        if (!isNaN(Number(columnId)) && !ids.includes(String(columnId))) {
          ids.push(String(columnId));
        }
        return ids;
      }, []),
    );
    return { selectedCells, selectedRows, selectedColumns };
  }, [selectedIds]);

  return { selectedCells, selectedRows, selectedColumns };
};
