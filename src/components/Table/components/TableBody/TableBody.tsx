import { memo, useMemo } from 'react';
import { useGetMinAndMaxExcerpt, useGetSums, useTableSelection } from '../../hooks';
import type { ColumnItem, NormalizedDocuments, TableRowItem } from '../../types';
import { TableBodyLeft } from '../TableBodyLeft';
import { TableBodyMiddle } from '../TableBodyMiddle';
import { TableBodyRight } from '../TableBodyRight';
import { TableFooterCell } from '../TableFooterCell';

import styles from './TableBody.module.css';
import { createGetCellBackground } from '../../helpers';

type TableBodyArgs = {
  normalizedDocuments: NormalizedDocuments;
  tableData: TableRowItem[];
  leftColumns: ColumnItem[];
  dynamicColumns: number[];
  rightColumns: ColumnItem[];
  scrollbarGutter: number;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  isBigData?: boolean;
  isDark: boolean;
  documents: TableRowItem[];
  midData?: {
    id: number;
    order: number;
    color: string;
  }[];
  bodyScrollRef: React.RefObject<HTMLDivElement | null>;
  headerScrollRef: React.RefObject<HTMLDivElement | null>;
  footerScrollRef: React.RefObject<HTMLDivElement | null>;
};

export const TableBody = memo(
  ({
    normalizedDocuments,
    documents,
    tableData,
    leftColumns,
    dynamicColumns,
    rightColumns,
    scrollbarGutter,
    viewportRef,
    isBigData,
    isDark,
    midData,
    bodyScrollRef,
    headerScrollRef,
    footerScrollRef,
  }: TableBodyArgs) => {
    const { allExcerptSums, allTagsSum } = useGetSums({ data: isBigData ? documents : normalizedDocuments, isBigData });

    const columns = useMemo(
      () => [...leftColumns, ...dynamicColumns, ...rightColumns],
      [leftColumns, dynamicColumns, rightColumns],
    );

    const rowIds = useMemo(() => normalizedDocuments?.map((document) => document.id), [normalizedDocuments]);
    const columnIds = useMemo(
      () => columns.map((column) => (typeof column === 'number' ? column : column.id)),
      [columns],
    );
    const {
      handleFooterCellClick,
      handleAllTagsCellClick,
      handleCellClick,
      handleMouseDown,
      handleMouseMove,
      handleFooterAlltagsCellClick,
    } = useTableSelection({
      columns,
      rowIds,
      columnIds,
    });

    const { minAllExcerpt, maxAllExcerpt } = useGetMinAndMaxExcerpt({
      data: isBigData ? documents : normalizedDocuments,
      isBigData,
    });

    const getCellBackground = useMemo(
      () => createGetCellBackground({ min: minAllExcerpt, max: maxAllExcerpt, isDark }),
      [minAllExcerpt, maxAllExcerpt, isDark],
    );

    return (
      <>
        <div ref={viewportRef} className={styles['table-viewport']}>
          <div className={styles['table-body']}>
            <TableBodyLeft tableData={tableData} leftColumns={leftColumns} />
            <TableBodyMiddle
              bodyScrollRef={bodyScrollRef}
              headerScrollRef={headerScrollRef}
              footerScrollRef={footerScrollRef}
              tableData={tableData}
              isBigData={isBigData}
              dynamicColumns={dynamicColumns}
              getCellBackground={getCellBackground}
              handleCellClick={handleCellClick}
              handleMouseMove={handleMouseMove}
              handleMouseDown={handleMouseDown}
            />
            <TableBodyRight
              tableData={tableData}
              handleAllTagsCellClick={handleAllTagsCellClick}
              rightColumns={rightColumns}
              handleMouseMove={handleMouseMove}
              getCellBackground={getCellBackground}
            />
          </div>
        </div>
        <div className={styles['table-footer']}>
          <div className={styles['footer-left']}>
            <TableFooterCell value="All documents" className="documents" />
          </div>
          <div ref={footerScrollRef} className={`${styles['footer-mid']} ${styles['sync-footer']}`}>
            {midData?.map((tag) => {
              return (
                <TableFooterCell
                  columnId={tag.order}
                  onMouseMove={handleMouseMove}
                  onClick={handleFooterCellClick}
                  onMouseDown={handleMouseDown}
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
              <TableFooterCell
                columnId={column.id}
                key={column.id}
                value={column.id === 'allTags' || column.id === 'allClaims' ? allTagsSum : null}
                onClick={column.id === 'allTags' || column.id === 'allClaims' ? handleFooterAlltagsCellClick : null}
                className={String(column.id)}
                isTableTag
                onMouseMove={handleMouseMove}
                getCellBackground={getCellBackground}
              />
            ))}
          </div>
          {scrollbarGutter > 0 && <div className={styles['scrollbar-spacer']} style={{ width: scrollbarGutter }} />}
        </div>
      </>
    );
  },
);
