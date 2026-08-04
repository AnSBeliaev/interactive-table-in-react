import { useMemo } from 'react';
import type { TableRowItem, Tag } from '../types';

type UseNormalizeDocumentsArgs<T> = {
  documents: T[];
};

const isTag = (value: string | number | Tag | null): value is Tag => {
  return Boolean(value && typeof value === 'object' && 'allExcerpt' in value);
};

export const useNormalizeDocuments = <T extends TableRowItem>({ documents }: UseNormalizeDocumentsArgs<T>) => {
  return useMemo(() => {
    return documents.map((document) => {
      const tagsByOrder: Tag[] = [];
      const documentEntries: [string, string | number | Tag | null][] = Object.entries(document);

      documentEntries.forEach((item) => {
        const value = item[1];
        if (isTag(value)) {
          tagsByOrder.push(value);
        }
      });

      return {
        ...document,
        tagsByOrder: [...tagsByOrder],
      };
    });
  }, [documents]);
};
