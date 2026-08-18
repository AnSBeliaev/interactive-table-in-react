import { useMemo } from 'react';
import type { NormalizedDocuments, TableRowItem } from '../types';

type UseGetSumsArgs = { data: NormalizedDocuments | TableRowItem[]; isBigData?: boolean };

export const useGetSums = ({ data, isBigData }: UseGetSumsArgs) => {
  const allExcerptSums = useMemo(() => {
    const sums: Record<number, number> = {};

    data.forEach((document) => {
      if (document.tagsByOrder && !isBigData) {
        document.tagsByOrder.forEach((tag) => {
          const value = Number(tag.allExcerpt) || 0;
          sums[tag.order] = (sums[tag.order] ?? 0) + value;
        });
      } else {
        document.claims?.forEach((claim) => {
          const value = Number(claim.allExcerpts) || 0;
          sums[claim.order] = (sums[claim.order] ?? 0) + value;
        });
      }
    });

    return sums;
  }, [data, isBigData]);

  const allTagsSum = useMemo(() => {
    let sum = 0;
    data.forEach((document) => {
      if (!isBigData && document.allTags) {
        sum += document.allTags;
      } else if (document.allClaims) {
        sum += document.allClaims;
      }
    });
    return sum;
  }, [data, isBigData]);

  return { allExcerptSums, allTagsSum };
};
