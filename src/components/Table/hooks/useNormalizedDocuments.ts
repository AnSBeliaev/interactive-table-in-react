import { useMemo } from 'react';
import type { TableRowItem, Tag } from '../types';

type UseNormalizedDocumentsArgs<T> = {
  documents: T[];
};

const isTag = (value: unknown): value is Tag => {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && 'allExcerpt' in value);
};

export const useNormalizedDocuments = <T extends TableRowItem>({ documents }: UseNormalizedDocumentsArgs<T>) => {
  return useMemo(() => {
    return documents.map((document) => {
      const tagsByOrder = new Map<number, Tag>([]);
      Object.entries(document).forEach(([, value]) => {
        if (isTag(value)) tagsByOrder.set(value.order, value);
      });
      return {
        ...document,
        tagsByOrder,
      };
    });
  }, [documents]);
};
