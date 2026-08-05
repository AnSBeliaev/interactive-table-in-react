import { useMemo } from 'react';

import { TableRow, TableHead, TableFooter } from './components';
import { useNormalizeDocuments } from './hooks';

import styles from './Table.module.css';

import type { ColumnItem, TableRowItem, TableData } from './types';

type TableProps<T> = {
  data: TableData<T>;
  leftColumns: ColumnItem<T>[];
  rightColumns: ColumnItem<T>[];
};

export const Table = ({ data, leftColumns, rightColumns }: TableProps<TableRowItem>) => {
  const { documents, tagsForHeader } = data;
  const normalizedDocuments = useNormalizeDocuments({ documents });

  const dynamicColumns = tagsForHeader.map((tag) => {
    return tag.order;
  });

  const allColumns = [...leftColumns, ...dynamicColumns, ...rightColumns];
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
      <div className={styles['table']}>
        <div className={styles['table-header']}>
          <div className={styles['header-left']}>
            {leftColumns.map((headItem) => {
              return <TableHead key={headItem.dataIndex} item={headItem.title} className={headItem.id} />;
            })}
          </div>
          <div className={styles['header-mid']}>
            {data.tagsForHeader.map((tag) => (
              <TableHead key={tag.order} item={String(tag.order + 1)} tagColor={tag.color} className={String(tag.id)} />
            ))}
          </div>
          <div className={styles['header-right']}>
            {rightColumns.map((headItem) => {
              console.log('headItem.id: >>>', headItem.id);
              return <TableHead key={headItem.dataIndex} item={headItem.title} className={headItem.id} />;
            })}
          </div>
        </div>
        <div className={styles['table-viewport']}>
          <div className={styles['table-body']}>
            <div className={styles['body-left']}>
              {normalizedDocuments?.map((tableRowItem: TableRowItem) => {
                return <TableRow key={tableRowItem.id} data={tableRowItem} columns={leftColumns} />;
              })}
            </div>
            <div className={styles['body-mid']}>
              {normalizedDocuments?.map((tableRowItem: TableRowItem) => {
                return <TableRow key={tableRowItem.id} data={tableRowItem} columns={dynamicColumns} />;
              })}
            </div>
            <div className={styles['body-right']}>
              {normalizedDocuments?.map((tableRowItem: TableRowItem) => {
                return <TableRow key={tableRowItem.id} data={tableRowItem} columns={rightColumns} />;
              })}
            </div>
          </div>
        </div>
        <div className={styles['table-footer']}>
          <TableFooter allExcerptSums={allExcerptSums} allTagsSum={allTagsSum} columns={allColumns} />
        </div>
      </div>
    </div>
  );
};
