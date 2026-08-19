import { useMemo } from 'react';

import {
  TableHead,
  TableFooterCell,
  TableStatistic,
  TableBodyMiddle,
  TableBodyRight,
  TableBodyLeft,
} from './components';
import {
  useGetSums,
  useGetMinAndMaxExcerpt,
  useGetScrollbarGutter,
  useNormalizedDocuments,
  useSyncScroll,
  useTableSelection,
} from './hooks';
import { useTheme } from '../../constext';

import styles from './Table.module.css';

import type { TableRowItem, TableProps, NormalizedDocuments } from './types';
import { createGetCellBackground } from './helpers';

export const Table = ({ data, leftColumns, rightColumns, isBigData }: TableProps<TableRowItem>) => {
  const { isDark } = useTheme();
  const { documents, tagsForHeader } = data;
  const normalizedDocuments: NormalizedDocuments = useNormalizedDocuments({ documents });

  const tableData = useMemo(() => {
    return !isBigData ? normalizedDocuments : documents;
  }, [isBigData, normalizedDocuments, documents]);

  const { scrollbarGutter, viewportRef } = useGetScrollbarGutter(normalizedDocuments);
  const { handleScroll, headerScrollRef, bodyScrollRef, footerScrollRef } = useSyncScroll<HTMLDivElement>();

  const dynamicColumns = useMemo(() => {
    if (!isBigData && tagsForHeader) {
      return tagsForHeader.map((tag) => tag.order);
    } else {
      let numberOfColumns = 0;
      documents.forEach((document) => {
        if (document.claims && document.claims.length > numberOfColumns) {
          numberOfColumns = document.claims.length;
        }
      });
      const columns = Array.from({ length: numberOfColumns }, (_, index) => index);
      return columns;
    }
  }, [tagsForHeader, isBigData, documents]);

  const bigDataTagsForHeader = dynamicColumns.map((column) => {
    return {
      id: column,
      order: column,
      color: '',
    };
  });
  const midData = isBigData ? bigDataTagsForHeader : data.tagsForHeader;

  const { allExcerptSums, allTagsSum } = useGetSums({ data: isBigData ? documents : normalizedDocuments, isBigData });
  const { minAllExcerpt, maxAllExcerpt } = useGetMinAndMaxExcerpt({
    data: isBigData ? documents : normalizedDocuments,
    isBigData,
  });

  const getCellBackground = useMemo(
    () => createGetCellBackground({ min: minAllExcerpt, max: maxAllExcerpt, isDark }),
    [minAllExcerpt, maxAllExcerpt, isDark],
  );

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

  return (
    <>
      <div className={styles['table-container']}>
        <div className={styles['table']}>
          <div className={styles['table-header']}>
            <div className={styles['header-left']}>
              {leftColumns.map((headItem) => {
                return <TableHead key={headItem.id} item={headItem.title} className={String(headItem.id)} />;
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
              {midData?.map((tag) => (
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
                return <TableHead key={headItem.dataIndex} item={headItem.title} className={String(headItem.id)} />;
              })}
            </div>
            {scrollbarGutter > 0 && <div className={styles['scrollbar-spacer']} style={{ width: scrollbarGutter }} />}
          </div>
          <div ref={viewportRef} className={styles['table-viewport']}>
            <div className={styles['table-body']}>
              <TableBodyLeft tableData={tableData} leftColumns={leftColumns} />
              <TableBodyMiddle
                bodyScrollRef={bodyScrollRef}
                headerScrollRef={headerScrollRef}
                footerScrollRef={footerScrollRef}
                handleScroll={handleScroll}
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
        </div>
      </div>
      <TableStatistic normalizedDocuments={normalizedDocuments} isBigData={isBigData} documents={documents} />
    </>
  );
};
