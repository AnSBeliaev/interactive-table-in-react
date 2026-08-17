import { useMemo } from 'react';
import type { NormalizedDocuments } from '../types';

type UseGetSumOfCellsArgs = {
  normalizedDocuments: NormalizedDocuments;
  selectedIds: Set<string>;
};

export const useGetSumOfCells = ({ normalizedDocuments, selectedIds }: UseGetSumOfCellsArgs) => {
  return useMemo(() => {
    return normalizedDocuments.reduce((sum, row) => {
      if (row.tagsByOrder && row.tagsByOrder instanceof Map) {
        row.tagsByOrder.forEach((cellValue, order) => {
          const compositeId = `${order}-${row.id}`;

          if (selectedIds.has(compositeId)) {
            const valueToAdd = Number(cellValue.allExcerpt || 0);
            sum += valueToAdd;
          }
        });
      }
      return sum;
    }, 0);
  }, [normalizedDocuments, selectedIds]);
};
