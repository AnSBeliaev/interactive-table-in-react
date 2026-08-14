import { useMemo } from 'react';
import type { NormalizeDocuments } from '../types';

export const useGetSums = (normalizedDocuments: NormalizeDocuments) => {
  const allExcerptSums = useMemo(() => {
    const sums: Record<number, number> = {};

    normalizedDocuments.forEach((document) => {
      if (document.tagsByOrder) {
        document.tagsByOrder.forEach((tag) => {
          const value = Number(tag.allExcerpt) || 0;
          sums[tag.order] = (sums[tag.order] ?? 0) + value;
        });
      }
    });

    return sums;
  }, [normalizedDocuments]);

  const allTagsSum = useMemo(() => {
    let sum = 0;
    normalizedDocuments.forEach((document) => {
      sum += document.allTags;
    });
    return sum;
  }, [normalizedDocuments]);

  return { allExcerptSums, allTagsSum };
};
