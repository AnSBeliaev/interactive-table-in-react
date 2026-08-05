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
          <div className={styles['footer-left']}>
            <TableFooter aria="left" />
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
            {data.tagsForHeader.map((tag) => (
              <TableFooter aria="mid" allExcerptSums={allExcerptSums} allTagsSum={allTagsSum} tag={tag} />
            ))}
          </div>
          <div className={styles['footer-right']}>
            {rightColumns.map((_, index) => {
              return <TableFooter aria="right" allTagsSum={index === 0 ? allTagsSum : null} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
