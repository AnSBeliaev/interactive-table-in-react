import { useMemo } from 'react';
import type { NormalizedDocuments, TableRowItem } from '../types';

type UseGetSumOfCellsArgs = {
  normalizedDocuments: NormalizedDocuments;
  selectedIds: Set<string>;
  documents: TableRowItem[];
  isBigData?: boolean;
};

export const useGetSumOfCells = ({ normalizedDocuments, selectedIds, documents, isBigData }: UseGetSumOfCellsArgs) => {
  return useMemo(() => {
    if (!isBigData) {
      return normalizedDocuments.reduce((sum, row) => {
        if (row.tagsByOrder) {
          row.tagsByOrder.forEach((cellValue, index) => {
            const compositeId = `${index}-${row.id}`;

            if (selectedIds.has(compositeId)) {
              const valueToAdd = Number(cellValue.allExcerpt || 0);
              sum += valueToAdd;
            }
          });
        }
        return sum;
      }, 0);
    }
    return documents.reduce((sum, row) => {
      row.claims?.forEach((cellValue) => {
        const compositeId = `${cellValue.order}-${row.id}`;

        if (selectedIds.has(compositeId)) {
          const valueToAdd = Number(cellValue.allExcerpts || 0);
          sum += valueToAdd;
        }
      });
      return sum;
    }, 0);
  }, [normalizedDocuments, selectedIds, documents, isBigData]);
};
