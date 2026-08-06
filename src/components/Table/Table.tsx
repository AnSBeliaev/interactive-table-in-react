import { useMemo } from 'react';

import { TableRow, TableHead, TableFooter } from './components';
import { useNormalizeDocuments, useSyncScroll } from './hooks';

import styles from './Table.module.css';

import type { ColumnItem, TableRowItem, TableData } from './types';

type TableProps<T> = {
  data: TableData<T>;
  leftColumns: ColumnItem<T>[];
  rightColumns: ColumnItem<T>[];
};

export const Table = ({ data, leftColumns, rightColumns }: TableProps<TableRowItem>) => {
  const { handleScroll, headerScrollRef, bodyScrollRef, footerScrollRef } = useSyncScroll<HTMLDivElement>();

  const { documents, tagsForHeader } = data;
  const normalizedDocuments = useNormalizeDocuments({ documents });

  const dynamicColumns = tagsForHeader.map((tag) => {
    return tag.order;
  });

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
    console.log('normalizedDocuments: >>>', normalizedDocuments);
    return sum;
  }, [normalizedDocuments]);

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

  const { minAllTags, maxAllTags } = useMemo(() => {
    let minAllTags: number | null = null;
    let maxAllTags: number | null = null;
    normalizedDocuments.forEach((document) => {
      if (minAllTags == null) minAllTags = document.allTags;
      if (maxAllTags == null) maxAllTags = document.allTags;
      if (document.allTags < minAllTags) minAllTags = document.allTags;
      if (document.allTags > maxAllTags) maxAllTags = document.allTags;
    });
    if (minAllTags == 0) minAllTags = 1;
    return { minAllTags, maxAllTags };
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
          <div
            ref={headerScrollRef}
            onScroll={() =>
              handleScroll({
                sourceRef: headerScrollRef,
                firstTargetRef: bodyScrollRef,
                secondTargetRef: footerScrollRef,
              })
            }
            className={styles['header-mid']}
          >
            {data.tagsForHeader.map((tag) => (
              <TableHead key={tag.order} item={String(tag.order + 1)} tagColor={tag.color} className={String(tag.id)} />
            ))}
          </div>
          <div className={styles['header-right']}>
            {rightColumns.map((headItem) => {
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
            <div
              ref={bodyScrollRef}
              onScroll={() =>
                handleScroll({
                  sourceRef: bodyScrollRef,
                  firstTargetRef: headerScrollRef,
                  secondTargetRef: footerScrollRef,
                })
              }
              className={styles['body-mid']}
            >
              {normalizedDocuments?.map((tableRowItem: TableRowItem) => {
                return (
                  <TableRow
                    key={tableRowItem.id}
                    data={tableRowItem}
                    columns={dynamicColumns}
                    minAllExcerpt={minAllExcerpt}
                    maxAllExcerpt={maxAllExcerpt}
                  />
                );
              })}
            </div>
            <div className={styles['body-right']}>
              {normalizedDocuments?.map((tableRowItem: TableRowItem) => {
                return (
                  <TableRow
                    key={tableRowItem.id}
                    data={tableRowItem}
                    columns={rightColumns}
                    minAllExcerpt={minAllTags}
                    maxAllExcerpt={maxAllTags}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles['table-footer']}>
          <div className={styles['footer-left']}>
            <TableFooter value="All documents" className="documents" />
          </div>
          <div
            ref={footerScrollRef}
            onScroll={() =>
              handleScroll({
                sourceRef: footerScrollRef,
                firstTargetRef: headerScrollRef,
                secondTargetRef: bodyScrollRef,
              })
            }
            className={styles['footer-mid']}
          >
            {tagsForHeader.map((tag) => (
              <TableFooter key={tag.order} value={allExcerptSums[tag.order]} className="tag" />
            ))}
          </div>
          <div className={styles['footer-right']}>
            {rightColumns.map((column) => (
              <TableFooter
                key={column.id}
                value={column.dataIndex === 'allTags' ? allTagsSum : ''}
                className={column.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
