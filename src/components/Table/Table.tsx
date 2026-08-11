import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { TableRow, TableHead, TableFooter } from './components';
import { useGetMinAndMaxExcerpt, useGetSelectedIdsByRow, useNormalizeDocuments, useSyncScroll } from './hooks';
import { useSelection, useTheme } from '../../constext';

import styles from './Table.module.css';

import type { ColumnItem, TableRowItem, TableData } from './types';
import { createGetCellBackground } from './helpers';
import { getCellIdsInRange, getNextAnchorId } from './components/TableRow/helpers';

type TableProps<T> = {
  data: TableData<T>;
  leftColumns: ColumnItem<T>[];
  rightColumns: ColumnItem<T>[];
};

const EMPTY_SELECTED_CELL_IDS: ReadonlySet<string> = new Set();

export const Table = ({ data, leftColumns, rightColumns }: TableProps<TableRowItem>) => {
  const { isDark } = useTheme();
  const { handleScroll, headerScrollRef, bodyScrollRef, footerScrollRef } = useSyncScroll<HTMLDivElement>();

  const { selectedIds, dispatch, setAnchorId, anchorId, isDragging, setIsDragging } = useSelection();

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
  const rowIds = useMemo(() => normalizedDocuments?.map((document) => document.id), [normalizedDocuments]);

  const columnIds = useMemo(() => dynamicColumns.filter((column) => typeof column === 'number'), [dynamicColumns]);

  const selectedIdsRef = useRef(selectedIds);
  const anchorIdRef = useRef(anchorId);
  const isDraggingRef = useRef(isDragging);
  const rowIdsRef = useRef(rowIds);
  const columnIdsRef = useRef(columnIds);
  const didDragRef = useRef(false);
  const mouseDownCellIdRef = useRef('');
  const mouseDownShiftRef = useRef(false);

  useLayoutEffect(() => {
    selectedIdsRef.current = selectedIds;
    anchorIdRef.current = anchorId;
    isDraggingRef.current = isDragging;
    rowIdsRef.current = rowIds;
    columnIdsRef.current = columnIds;
  }, [selectedIds, anchorId, isDragging, rowIds, columnIds]);

  const applyCellClickSelection = useCallback(
    (cellId: string, shiftKey: boolean) => {
      const currentAnchorId = anchorIdRef.current;
      const currentRowIds = rowIdsRef.current;
      const currentColumnIds = columnIdsRef.current;

      if (!cellId || !dispatch || !setAnchorId) return;

      if (shiftKey && currentAnchorId) {
        getCellIdsInRange({
          anchorId: currentAnchorId,
          currentId: cellId,
          rowIds: currentRowIds,
          columnIds: currentColumnIds,
          dispatch,
        });
        return;
      }

      dispatch({ type: 'clear' });
      dispatch({ type: 'add', id: cellId });
      setAnchorId(cellId);
      anchorIdRef.current = cellId;
    },
    [dispatch, setAnchorId],
  );

  const handleCellClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => {
      if (!cellId || !dispatch || !setAnchorId) return;
      if (!(event.ctrlKey || event.metaKey)) return;

      const currentSelectedIds = selectedIdsRef.current;
      if (currentSelectedIds.has(cellId)) {
        const isAnchor = anchorIdRef.current === cellId;

        if (isAnchor && currentSelectedIds.size <= 1) return;

        const nextIds = new Set(currentSelectedIds);
        nextIds.delete(cellId);
        dispatch({ type: 'set', ids: nextIds });

        if (isAnchor) {
          const nextAnchorId = getNextAnchorId(nextIds, rowIdsRef.current ?? [], columnIdsRef.current ?? []);
          anchorIdRef.current = nextAnchorId;
          setAnchorId(nextAnchorId);
        }
      } else {
        dispatch({ type: 'add', id: cellId });
        anchorIdRef.current = cellId;
        setAnchorId(cellId);
      }
    },
    [dispatch, setAnchorId],
  );

  const handleAllTagsCellClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, rowId: string) => {
      const numericRowId = Number(rowId);
      if (!Number.isFinite(numericRowId)) return;

      const orders = columnIdsRef.current ?? [];
      if (orders.length === 0) return;

      const idsForThisRowArr = orders.map((order) => `${order}-${numericRowId}`);
      const idsForThisRowSet = new Set<string>(idsForThisRowArr);
      const selectedIdsNow = selectedIdsRef.current;

      const isRowFullySelected = idsForThisRowArr.every((id) => selectedIdsNow.has(id));

      if (event.ctrlKey || event.metaKey) {
        const currentAnchorId = anchorIdRef.current;
        const rowHasAnchor = Boolean(currentAnchorId && idsForThisRowSet.has(currentAnchorId));

        if (isRowFullySelected) {
          if (rowHasAnchor) return;

          const nextIds = new Set(selectedIdsNow);
          idsForThisRowArr.forEach((id) => nextIds.delete(id));
          dispatch({ type: 'set', ids: nextIds });
        } else {
          const nextIds = new Set(selectedIdsNow);
          idsForThisRowArr.forEach((id) => nextIds.add(id));
          dispatch({ type: 'set', ids: nextIds });

          const nextAnchorId = `${orders[0]}-${numericRowId}`;
          anchorIdRef.current = nextAnchorId;
          setAnchorId(nextAnchorId);
        }
        return;
      }

      if (event.shiftKey) {
        const currentAnchorId = anchorIdRef.current;
        if (!currentAnchorId) return;
        const anchorSep = currentAnchorId.lastIndexOf('-');
        if (anchorSep === -1) return;

        const anchorRowId = Number(currentAnchorId.slice(anchorSep + 1));
        if (!Number.isFinite(anchorRowId)) return;

        const rowIds = rowIdsRef.current;
        if (!rowIds) return;

        const r1 = rowIds.indexOf(anchorRowId);
        const r2 = rowIds.indexOf(numericRowId);
        if (r1 === -1 || r2 === -1) return;

        const start = Math.min(r1, r2);
        const end = Math.max(r1, r2);

        const rangeIds = new Set<string>();
        for (let i = start; i <= end; i++) {
          const rowIdInRange = rowIds[i];
          for (const order of orders) {
            rangeIds.add(`${order}-${rowIdInRange}`);
          }
        }

        dispatch({ type: 'set', ids: rangeIds });
        return;
      }

      dispatch({ type: 'set', ids: idsForThisRowSet });

      const nextAnchorId = `${orders[0]}-${numericRowId}`;
      anchorIdRef.current = nextAnchorId;
      setAnchorId(nextAnchorId);
    },
    [dispatch, setAnchorId],
  );

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (!didDragRef.current && mouseDownCellIdRef.current) {
      applyCellClickSelection(mouseDownCellIdRef.current, mouseDownShiftRef.current);
    }

    didDragRef.current = false;
    mouseDownCellIdRef.current = '';
    mouseDownShiftRef.current = false;
  }, [applyCellClickSelection, setIsDragging]);

  useEffect(() => {
    window.addEventListener('mouseup', endDrag);
    return () => window.removeEventListener('mouseup', endDrag);
  }, [endDrag]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent, currentId: string) => {
      if (!currentId || event.ctrlKey || event.metaKey) return;
      event.preventDefault();

      didDragRef.current = false;
      mouseDownCellIdRef.current = currentId;
      mouseDownShiftRef.current = event.shiftKey;

      if (!event.shiftKey) {
        anchorIdRef.current = currentId;
        setAnchorId(currentId);
      }

      isDraggingRef.current = true;
      setIsDragging(true);
    },
    [setAnchorId, setIsDragging],
  );

  const handleMouseMove = useCallback(
    (currentId: string) => {
      if (!isDraggingRef.current || !anchorIdRef.current || !currentId) {
        return;
      }

      if (currentId === anchorIdRef.current) return;

      didDragRef.current = true;
      getCellIdsInRange({
        anchorId: anchorIdRef.current,
        currentId,
        rowIds: rowIdsRef.current,
        columnIds: columnIdsRef.current,
        dispatch,
      });
    },
    [dispatch],
  );

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
