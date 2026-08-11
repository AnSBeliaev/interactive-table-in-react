import { useMemo } from 'react';
import type { TableRowItem, Tag } from '../types';

export const useGetMinAndMaxExcerpt = (
  normalizedDocuments: (TableRowItem & {
    tagsByOrder: Tag[];
  })[],
) => {
  const { minAllExcerpt, maxAllExcerpt } = useMemo(() => {
    let minAllExcerpt: number | null = null;
    let maxAllExcerpt: number | null = null;
    normalizedDocuments.forEach((document) => {
      if (!document.tagsByOrder) return;
      document.tagsByOrder.forEach((tag) => {
        if (minAllExcerpt == null) minAllExcerpt = Number(tag.allExcerpt);
        if (maxAllExcerpt == null) maxAllExcerpt = Number(tag.allExcerpt);
        if (Number(tag.allExcerpt) < minAllExcerpt) minAllExcerpt = Number(tag.allExcerpt);
        if (Number(tag.allExcerpt) > maxAllExcerpt) maxAllExcerpt = Number(tag.allExcerpt);
      });
    });
    return { minAllExcerpt, maxAllExcerpt };
  }, [normalizedDocuments]);
  return { minAllExcerpt, maxAllExcerpt };
};
