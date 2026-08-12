import { useMemo } from 'react';

import { TableRow, TableHead, TableFooter } from './components';
import {
  useGetMinAndMaxExcerpt,
  useGetSelectedIdsByRow,
  useNormalizeDocuments,
  useSyncScroll,
  useTableSelection,
} from './hooks';
import { useSelection, useTheme } from '../../constext';

import styles from './Table.module.css';

import type { ColumnItem, TableRowItem, TableData } from './types';
import { createGetCellBackground } from './helpers';
type TableProps<T> = {
  data: TableData<T>;
  leftColumns: ColumnItem<T>[];
  rightColumns: ColumnItem<T>[];
};

const EMPTY_SELECTED_CELL_IDS: ReadonlySet<string> = new Set();

export const Table = ({ data, leftColumns, rightColumns }: TableProps<TableRowItem>) => {
  const { isDark } = useTheme();
  const { handleScroll, headerScrollRef, bodyScrollRef, footerScrollRef } = useSyncScroll<HTMLDivElement>();

  const { selectedIds } = useSelection();

  const { documents, tagsForHeader } = data;
  const normalizedDocuments = useNormalizeDocuments({ documents });

  const dynamicColumns = useMemo(() => tagsForHeader.map((tag) => tag.order), [tagsForHeader]);

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

  const { minAllExcerpt, maxAllExcerpt } = useGetMinAndMaxExcerpt(normalizedDocuments);

  const getCellBackground = useMemo(
    () => createGetCellBackground({ min: minAllExcerpt, max: maxAllExcerpt, isDark }),
    [minAllExcerpt, maxAllExcerpt, isDark],
  );

  const {
    handleFooterCellClick,
    handleAllTagsCellClick,
    handleCellClick,
    handleMouseDown,
    handleMouseMove,
    handleFooterAlltagsCellClick,
  } = useTableSelection({
    normalizedDocuments,
    dynamicColumns,
  });

  const selectedCellIdsByRow = useGetSelectedIdsByRow(selectedIds);

  return (
    <>
      <div className={styles['table-container']}>
        <div className={styles['table']}>
          <div className={styles['table-header']}>
            <div className={styles['header-left']}>
              {leftColumns.map((headItem) => {
                return <TableHead key={headItem.id} item={headItem.title} className={headItem.id} />;
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
                <TableHead
                  key={tag.order}
                  item={String(tag.order + 1)}
                  tagColor={tag.color}
                  className={String(tag.id)}
                />
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
                      getCellBackground={getCellBackground}
                      handleCellClick={handleCellClick}
                      handleMouseMove={handleMouseMove}
                      handleMouseDown={handleMouseDown}
                      selectedCellIds={selectedCellIdsByRow.get(tableRowItem.id) ?? EMPTY_SELECTED_CELL_IDS}
                    />
                  );
                })}
              </div>
              <div className={styles['body-right']}>
                {normalizedDocuments?.map((tableRowItem: TableRowItem) => {
                  return (
                    <TableRow
                      handleCellClick={handleAllTagsCellClick}
                      key={tableRowItem.id}
                      data={tableRowItem}
                      columns={rightColumns}
                      getCellBackground={getCellBackground}
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
              {tagsForHeader.map((tag) => {
                return (
                  <TableFooter
                    columnId={tag.order}
                    onClick={handleFooterCellClick}
                    key={tag.order}
                    value={allExcerptSums[tag.order]}
                    className="tag"
                    isTableTag
                    getCellBackground={getCellBackground}
                  />
                );
              })}
            </div>
            <div className={styles['footer-right']}>
              {rightColumns.map((column) => (
                <TableFooter
                  key={column.id}
                  value={column.id === 'allTags' ? allTagsSum : null}
                  onClick={column.id === 'allTags' ? handleFooterAlltagsCellClick : null}
                  className={column.id}
                  isTableTag
                  getCellBackground={getCellBackground}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
