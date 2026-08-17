import { useMemo } from 'react';

import { TableRow, TableHead, TableFooterCell, TableStatistic } from './components';
import {
  useGetSums,
  useGetMinAndMaxExcerpt,
  useGetScrollbarGutter,
  useGetSelectedIdsByRow,
  useNormalizedDocuments,
  useSyncScroll,
  useTableSelection,
  useGetStatistic,
  useGetSumOfCells,
} from './hooks';
import { useSelection, useTheme } from '../../constext';

import styles from './Table.module.css';

import type { TableRowItem, TableProps, NormalizedDocuments } from './types';
import { createGetCellBackground } from './helpers';
import { EMPTY_SELECTED_CELL_IDS } from './constants';

export const Table = ({ data, leftColumns, rightColumns }: TableProps<TableRowItem>) => {
  const { isDark } = useTheme();
  const { documents, tagsForHeader } = data;
  const normalizedDocuments: NormalizedDocuments = useNormalizedDocuments({ documents });

  const { selectedIds } = useSelection();

  const { selectedCells, selectedRows, selectedColumns } = useGetStatistic(selectedIds);

  const { scrollbarGutter, viewportRef } = useGetScrollbarGutter(normalizedDocuments);
  const { handleScroll, headerScrollRef, bodyScrollRef, footerScrollRef } = useSyncScroll<HTMLDivElement>();

  const dynamicColumns = useMemo(() => tagsForHeader.map((tag) => tag.order), [tagsForHeader]);
  const { allExcerptSums, allTagsSum } = useGetSums(normalizedDocuments);
  const { minAllExcerpt, maxAllExcerpt } = useGetMinAndMaxExcerpt(normalizedDocuments);

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

  const sumOfCells = useGetSumOfCells({ normalizedDocuments, selectedIds });

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

  const selectedTagIdsByRow = useGetSelectedIdsByRow(selectedIds, true);
  const selectedSideIdsByRow = useGetSelectedIdsByRow(selectedIds, false);

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
            {scrollbarGutter > 0 && <div className={styles['scrollbar-spacer']} style={{ width: scrollbarGutter }} />}
          </div>
          <div ref={viewportRef} className={styles['table-viewport']}>
            <div className={styles['table-body']}>
              <div className={styles['body-left']}>
                {normalizedDocuments?.map((tableRowItem: TableRowItem) => {
                  return (
                    <TableRow
                      key={tableRowItem.id}
                      data={tableRowItem}
                      columns={leftColumns}
                      selectedCellIds={selectedSideIdsByRow.get(tableRowItem.id) ?? EMPTY_SELECTED_CELL_IDS}
                    />
                  );
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
                      selectedCellIds={selectedTagIdsByRow.get(tableRowItem.id) ?? EMPTY_SELECTED_CELL_IDS}
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
                      handleMouseMove={handleMouseMove}
                      getCellBackground={getCellBackground}
                      selectedCellIds={selectedSideIdsByRow.get(tableRowItem.id) ?? EMPTY_SELECTED_CELL_IDS}
                    />
                  );
                })}
              </div>
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
              {tagsForHeader.map((tag) => {
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
                    isSelected={selectedIds.has(`${tag.order}-footer`)}
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
                  value={column.id === 'allTags' ? allTagsSum : null}
                  onClick={column.id === 'allTags' ? handleFooterAlltagsCellClick : null}
                  className={column.id}
                  isTableTag
                  isSelected={selectedIds.has(`${column.id}-footer`)}
                  onMouseMove={handleMouseMove}
                  getCellBackground={getCellBackground}
                />
              ))}
            </div>
            {scrollbarGutter > 0 && <div className={styles['scrollbar-spacer']} style={{ width: scrollbarGutter }} />}
          </div>
        </div>
      </div>
      <TableStatistic
        numberOfCells={selectedCells.size}
        numberOfRows={selectedRows.size}
        numberOfColumns={selectedColumns.size}
        sumOfCells={sumOfCells}
      />
    </>
  );
};
