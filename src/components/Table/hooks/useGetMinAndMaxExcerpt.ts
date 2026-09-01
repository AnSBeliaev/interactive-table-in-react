import { useMemo } from 'react';
import type { Claim, NormalizedDocuments, TableRowItem, Tag } from '../types';

type UseGetMinAndMaxExcerptArgs = { data: NormalizedDocuments | TableRowItem[]; isBigData?: boolean };

export const useGetMinAndMaxExcerpt = ({ data, isBigData }: UseGetMinAndMaxExcerptArgs) => {
  const { minAllExcerpt, maxAllExcerpt } = useMemo(() => {
    let minAllExcerpt: number | null = null;
    let maxAllExcerpt: number | null = null;
    data.forEach((document) => {
      if (isBigData) {
        document.claims?.forEach((claim: Claim) => {
          if (minAllExcerpt == null) minAllExcerpt = Number(claim.allExcerpts);
          if (maxAllExcerpt == null) maxAllExcerpt = Number(claim.allExcerpts);
          if (Number(claim.allExcerpts) < minAllExcerpt) minAllExcerpt = Number(claim.allExcerpts);
          if (Number(claim.allExcerpts) > maxAllExcerpt) maxAllExcerpt = Number(claim.allExcerpts);
        });
      } else {
        document.tagsByOrder?.forEach((tag: Tag) => {
          if (minAllExcerpt == null) minAllExcerpt = Number(tag.allExcerpt);
          if (maxAllExcerpt == null) maxAllExcerpt = Number(tag.allExcerpt);
          if (Number(tag.allExcerpt) < minAllExcerpt) minAllExcerpt = Number(tag.allExcerpt);
          if (Number(tag.allExcerpt) > maxAllExcerpt) maxAllExcerpt = Number(tag.allExcerpt);
        });
      }
    });
    return { minAllExcerpt, maxAllExcerpt };
  }, [data, isBigData]);
  return { minAllExcerpt, maxAllExcerpt };
};
