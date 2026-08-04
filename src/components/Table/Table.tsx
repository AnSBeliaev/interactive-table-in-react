import { useMemo } from 'react';
import { TableRow, TableHead, TableFooter } from './components';
import { STATIC_LEFT_COLUMNS, STATIC_RIGHT_COLUMNS } from './constants/columns';

import styles from './Table.module.css';

import type { TableData, TableRowItem, Tag } from './types';

type TableProps = {
  data: TableData;
};

const isTag = (value: string | number | Tag | null): value is Tag => {
  return Boolean(value && typeof value === 'object' && 'allExcerpt' in value);
};

type NormalisedTableRowItem = TableRowItem & { tagsByOrder?: Tag[] };

export const Table = ({ data }: TableProps) => {
  const normalizedDocuments: NormalisedTableRowItem[] = useMemo(() => {
    return data.documents.map((document) => {
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
  }, [data.documents]);

  const dynamicColumns = data.tagsForHeader.map((tag) => {
    return tag.order;
  });
  const allColumns = [...STATIC_LEFT_COLUMNS, ...dynamicColumns, ...STATIC_RIGHT_COLUMNS];

  const allExcerptSums: Record<number, number> = {};

  normalizedDocuments.forEach((document) => {
    if (document.tagsByOrder) {
      document.tagsByOrder.forEach((tag) => {
        const value = Number(tag.allExcerpt) || 0;
        allExcerptSums[tag.order] = (allExcerptSums[tag.order] ?? 0) + value;
      });
    }
  });

  const allTagsSum = useMemo(() => {
    let sum = 0;
    normalizedDocuments.forEach((document) => {
      sum += document.allTags;
    });
    return sum;
  }, [normalizedDocuments]);

  return (
    <div className={styles['table-container']}>
      <table>
        <thead>
          <tr>
            {allColumns.map((headItem, headItemIndex) => {
              if (typeof headItem === 'number') {
                return (
                  <TableHead
                    key={headItem}
                    item={String(headItem + 1)}
                    tagsColor={data.tagsForHeader.filter((tag, tagColorIndex) => {
                      if (headItemIndex - 2 === tagColorIndex) return tag.color;
                    })}
                  />
                );
              }
              return <TableHead key={headItem.dataIndex} item={headItem.title} />;
            })}
          </tr>
        </thead>
        <tbody>
          {normalizedDocuments?.map((tableRowItem: NormalisedTableRowItem) => {
            return <TableRow key={tableRowItem.id} data={tableRowItem} columns={allColumns} />;
          })}
        </tbody>
        <tfoot>
          <TableFooter allExcerptSums={allExcerptSums} allTagsSum={allTagsSum} columns={allColumns} />
        </tfoot>
      </table>
    </div>
  );
};
