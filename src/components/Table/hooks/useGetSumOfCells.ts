import { useMemo } from 'react';
import type { NormalizedDocuments, TableRowItem } from '../types';

type UseGetSumOfCellsArgs = {
  normalizedDocuments: NormalizedDocuments;
  selectedIds: Set<string>;
  documents: TableRowItem[];
  isBigData?: boolean;
  columnOrders: number[];
};

const EMPTY_SELECTED_IDS = new Set<string>();

const isFullSelection = (selectedIds: Set<string>) =>
  selectedIds.has('allClaims-footer') || selectedIds.has('allTags-footer');

const buildCellValuesMap = (
  normalizedDocuments: NormalizedDocuments,
  documents: TableRowItem[],
  isBigData: boolean | undefined,
  columnOrders: number[],
) => {
  const cellValues = new Map<string, number>();
  const visibleColumns = new Set(columnOrders);

  if (!isBigData) {
    for (const row of normalizedDocuments) {
      row.tagsByOrder?.forEach((cellValue, order) => {
        if (!visibleColumns.has(order)) return;
        cellValues.set(`${order}-${row.id}`, Number(cellValue.allExcerpt) || 0);
      });
    }
    return cellValues;
  }

  for (const row of documents) {
    row.claims?.forEach((cellValue) => {
      if (!visibleColumns.has(cellValue.order)) return;
      cellValues.set(`${cellValue.order}-${row.id}`, Number(cellValue.allExcerpts) || 0);
    });
  }

  return cellValues;
};

export const useGetSumOfCells = ({
  normalizedDocuments,
  selectedIds,
  documents,
  isBigData,
  columnOrders,
}: UseGetSumOfCellsArgs) => {
  const cellValues = useMemo(
    () => buildCellValuesMap(normalizedDocuments, documents, isBigData, columnOrders),
    [normalizedDocuments, documents, isBigData, columnOrders],
  );

  const totalSum = useMemo(() => {
    let sum = 0;
    for (const value of cellValues.values()) {
      sum += value;
    }
    return sum;
  }, [cellValues]);

  const selectAll = isFullSelection(selectedIds);
  const idsToSum = selectAll ? EMPTY_SELECTED_IDS : selectedIds;

  const selectedSum = useMemo(() => {
    let sum = 0;

    for (const id of idsToSum) {
      const value = cellValues.get(id);
      if (value !== undefined) {
        sum += value;
      }
    }

    return sum;
  }, [cellValues, idsToSum]);

  return selectAll ? totalSum : selectedSum;
};
