import { useMemo } from 'react';
import type { TableRowItem, Tag } from '../types';

type UseNormalizeDocumentsArgs<T> = {
  documents: T[];
};

const isTag = (value: unknown): value is Tag => {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && 'allExcerpt' in value);
};

export const useNormalizeDocuments = <T extends TableRowItem>({ documents }: UseNormalizeDocumentsArgs<T>) => {
  return useMemo(() => {
    return documents.map((document) => {
      const tagsByOrder: Tag[] = [];
      Object.entries(document).forEach(([, value]) => {
        if (isTag(value)) tagsByOrder.push(value);
      });

      return {
        ...document,
        tagsByOrder: [...tagsByOrder],
      };
    });
  }, [documents]);
};
