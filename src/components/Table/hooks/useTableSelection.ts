import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ColumnItem } from '../types';
import {
  addSideIds,
  getCellIdsInRange,
  getNextAnchorId,
  getRowAndColumnIds,
  getRowSelectedIds,
  removeSideIds,
  syncFullySelectedFooter,
  syncSelectedColumn,
  syncSelectedColumns,
  syncSelectedRow,
  syncSelectedRows,
} from '../helpers';
import { selectionStore } from '../../../constext/selection/selectionStore';

type UseTableSelectionArgs = {
  columns: (number | ColumnItem)[];
  columnIds: (string | number)[];
  rowIds: number[];
};

export const useTableSelection = ({ columnIds, rowIds, columns }: UseTableSelectionArgs) => {
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = selectionStore.dispatch;
  const setAnchorId = selectionStore.setAnchorId;

  const tagColumnIds = useMemo(
    () => columns.filter((column): column is number => typeof column === 'number'),
    [columns],
  );

  const anchorIdRef = useRef(selectionStore.getState().anchorId);
  const isDraggingRef = useRef(isDragging);
  const dragModeRef = useRef('cells');
  const rowIdsRef = useRef(rowIds);
  const columnIdsRef = useRef(columnIds);
  const tagColumnIdsRef = useRef(tagColumnIds);
  const didDragRef = useRef(false);
  const mouseDownCellIdRef = useRef('');
  const mouseDownShiftRef = useRef(false);

  const lastHoverIdRef = useRef('');
  const pendingSelectToEndRef = useRef(false);

  useLayoutEffect(() => {
    isDraggingRef.current = isDragging;
    rowIdsRef.current = rowIds;
    columnIdsRef.current = columnIds;
    tagColumnIdsRef.current = tagColumnIds;
  }, [isDragging, rowIds, columnIds, tagColumnIds]);

  const applyCellClickSelection = useCallback(
    (cellId: string, shiftKey: boolean) => {
      const currentAnchorId = anchorIdRef.current;
      const currentRowIds = rowIdsRef.current;
      const currentTagColumnIds = tagColumnIdsRef.current;

      if (!cellId || !dispatch || !setAnchorId) return;

      if (shiftKey && currentAnchorId) {
        getCellIdsInRange({
          anchorId: currentAnchorId,
          currentId: cellId,
          rowIds: currentRowIds,
          columnIds: currentTagColumnIds,
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

      const currentSelectedIds = selectionStore.getState().selectedIds;
      const tags = tagColumnIdsRef.current;
      const { columnId, rowId } = getRowAndColumnIds(cellId);

      if (currentSelectedIds.has(cellId)) {
        const isAnchor = anchorIdRef.current === cellId;
        if (isAnchor && currentSelectedIds.size <= 1) return;

        const nextIds = new Set(currentSelectedIds);
        nextIds.delete(cellId);
        syncSelectedRow(nextIds, rowId, tags);
        syncSelectedColumn(nextIds, columnId, rowIdsRef.current);
        syncFullySelectedFooter(nextIds, rowIdsRef.current, tags);
        dispatch({ type: 'set', ids: nextIds });

        if (isAnchor) {
          const nextAnchorId = getNextAnchorId(nextIds, rowIdsRef.current ?? [], columnIdsRef.current ?? []);
          anchorIdRef.current = nextAnchorId;
          setAnchorId(nextAnchorId);
        }
      } else {
        const nextIds = new Set(currentSelectedIds);
        nextIds.add(cellId);
        syncSelectedRow(nextIds, rowId, tags);
        syncSelectedColumn(nextIds, columnId, rowIdsRef.current);
        syncFullySelectedFooter(nextIds, rowIdsRef.current, tags);
        dispatch({ type: 'set', ids: nextIds });
        anchorIdRef.current = cellId;
        setAnchorId(cellId);
      }
    },
    [dispatch, setAnchorId],
  );

  const handleAllTagsCellClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => {
      const { rowId: numericRowId } = getRowAndColumnIds(cellId);
      if (numericRowId == null || !Number.isFinite(numericRowId)) return;

      const rowIds = rowIdsRef.current ?? [];
      const tagColumnIds = tagColumnIdsRef.current ?? [];
      if (rowIds.length === 0 || tagColumnIds.length === 0) return;

      const tagIdsForRow = tagColumnIds.map((order) => `${order}-${numericRowId}`);
      const idsForThisRowArray = [...tagIdsForRow, ...getRowSelectedIds(numericRowId)];
      const idsForThisRowSet = new Set<string>(idsForThisRowArray);

      const selectedIdsNow = selectionStore.getState().selectedIds;
      const isRowFullySelected = idsForThisRowArray.every((id) => selectedIdsNow.has(id));

      const applyRowSelection = (nextIds: Set<string>) => {
        syncSelectedRow(nextIds, numericRowId, tagColumnIds);
        syncSelectedColumns(nextIds, rowIds, tagColumnIds);
        dispatch({ type: 'set', ids: nextIds });
      };

      if (event.ctrlKey || event.metaKey) {
        const currentAnchorId = anchorIdRef.current;
        const rowHasAnchor = Boolean(currentAnchorId && idsForThisRowSet.has(currentAnchorId));

        if (isRowFullySelected) {
          if (rowHasAnchor) return;

          const nextIds = new Set(selectedIdsNow);
          idsForThisRowArray.forEach((id) => nextIds.delete(id));
          applyRowSelection(nextIds);
        } else {
          const nextIds = new Set(selectedIdsNow);
          idsForThisRowArray.forEach((id) => nextIds.add(id));
          applyRowSelection(nextIds);
          const nextAnchorId = `${tagColumnIds[0]}-${numericRowId}`;
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

        const r1 = rowIds.indexOf(anchorRowId);
        const r2 = rowIds.indexOf(numericRowId);
        if (r1 === -1 || r2 === -1) return;

        const start = Math.min(r1, r2);
        const end = Math.max(r1, r2);

        const rangeIds = new Set<string>();
        for (let i = start; i <= end; i++) {
          const rowIdInRange = rowIds[i];
          for (const order of tagColumnIds) {
            rangeIds.add(`${order}-${rowIdInRange}`);
          }
        }

        syncSelectedRows(rangeIds, rowIds, tagColumnIds);
        syncSelectedColumns(rangeIds, rowIds, tagColumnIds);
        dispatch({ type: 'set', ids: rangeIds });
        return;
      }

      applyRowSelection(new Set(idsForThisRowSet));

      const nextAnchorId = `${tagColumnIds[0]}-${numericRowId}`;
      anchorIdRef.current = nextAnchorId;
      setAnchorId(nextAnchorId);
    },
    [dispatch, setAnchorId],
  );

  const handleFooterAlltagsCellClick = useCallback(() => {
    dispatch({ type: 'clear' });
  }, [dispatch]);

  type SelectColumns = { anchorColumnOrder: number; currentColumnOrder: number };

  const selectColumns = useCallback(
    ({ anchorColumnOrder, currentColumnOrder }: SelectColumns) => {
      const c1 = tagColumnIds.indexOf(anchorColumnOrder);
      const c2 = tagColumnIds.indexOf(currentColumnOrder);

      if (c1 === -1 || c2 === -1) return;

      const colStart = Math.min(c1, c2);
      const colEnd = Math.max(c1, c2);

      const rangeIds = new Set<string>();
      for (let c = colStart; c <= colEnd; c++) {
        const order = tagColumnIds[c];
        const footerId = `${order}-footer`;
        rangeIds.add(footerId);
        for (const rowId of rowIds) {
          rangeIds.add(`${order}-${rowId}`);
        }
      }

      syncSelectedRows(rangeIds, rowIds, tagColumnIds);
      dispatch({ type: 'set', ids: rangeIds });
    },
    [dispatch, rowIds, tagColumnIds],
  );

  const selectColumnsRef = useRef(selectColumns);
  const didSelectToEndRef = useRef(false);

  useLayoutEffect(() => {
    selectColumnsRef.current = selectColumns;
  }, [selectColumns]);

  const handleFooterCellClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, columnOrder: string) => {
      const numericColumnOrder = Number(columnOrder);
      if (!Number.isFinite(numericColumnOrder)) return;

      const footerId = `${numericColumnOrder}-footer`;

      const rowIds = rowIdsRef.current ?? [];

      const tagColumnIds = tagColumnIdsRef.current ?? [];

      if (rowIds.length === 0 || tagColumnIds.length === 0) return;

      const idsForThisColumn = rowIds.map((rowId) => `${numericColumnOrder}-${rowId}`);
      const idsForThisColumnWithFooterCell = [...idsForThisColumn, footerId];
      const idsForThisColumnSet = new Set<string>(idsForThisColumnWithFooterCell);
      const selectedIdsNow = selectionStore.getState().selectedIds;
      const isColumnFullySelected = idsForThisColumnWithFooterCell.every((id) => selectedIdsNow.has(id));

      if (event.ctrlKey || event.metaKey) {
        const currentAnchorId = anchorIdRef.current;
        const columnHasAnchor = Boolean(currentAnchorId && idsForThisColumnSet.has(currentAnchorId));

        if (isColumnFullySelected) {
          if (columnHasAnchor) return;

          const nextIds = new Set(selectedIdsNow);
          idsForThisColumnWithFooterCell.forEach((id) => nextIds.delete(id));
          syncSelectedRows(nextIds, rowIds, tagColumnIds);
          dispatch({ type: 'set', ids: nextIds });
        } else {
          const nextIds = new Set(selectedIdsNow);
          idsForThisColumnWithFooterCell.forEach((id) => nextIds.add(id));
          syncSelectedRows(nextIds, rowIds, tagColumnIds);
          dispatch({ type: 'set', ids: nextIds });
          const nextAnchorId = `${numericColumnOrder}-${rowIds[0]}`;
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

        const anchorColumnOrder = Number(currentAnchorId.slice(0, anchorSep));
        if (!Number.isFinite(anchorColumnOrder)) return;
        selectColumns({ anchorColumnOrder, currentColumnOrder: numericColumnOrder });
        return;
      }

      const nextIds = new Set(idsForThisColumnSet);
      syncSelectedRows(nextIds, rowIds, tagColumnIds);
      dispatch({ type: 'set', ids: nextIds });

      const nextAnchorId = `${numericColumnOrder}-${rowIds[0]}`;
      anchorIdRef.current = nextAnchorId;
      setAnchorId(nextAnchorId);
    },
    [dispatch, setAnchorId, selectColumns],
  );

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    lastHoverIdRef.current = '';

    if (!didDragRef.current && mouseDownCellIdRef.current) {
      applyCellClickSelection(mouseDownCellIdRef.current, mouseDownShiftRef.current);
    }

    if (
      didDragRef.current &&
      dragModeRef.current === 'footer' &&
      pendingSelectToEndRef.current &&
      !didSelectToEndRef.current
    ) {
      const lastOrder = tagColumnIdsRef.current.at(-1);
      const anchorSep = anchorIdRef.current.lastIndexOf('-');
      const anchorColumnOrder = Number(anchorIdRef.current.slice(0, anchorSep));
      if (lastOrder != null) {
        selectColumns({ anchorColumnOrder, currentColumnOrder: lastOrder });
      }
    }
    pendingSelectToEndRef.current = false;
    didSelectToEndRef.current = false;
    didDragRef.current = false;
    mouseDownCellIdRef.current = '';
    mouseDownShiftRef.current = false;
  }, [applyCellClickSelection, setIsDragging, selectColumns]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent, currentId?: string) => {
      if (!currentId || event.ctrlKey || event.metaKey) return;
      event.preventDefault();

      didDragRef.current = false;
      pendingSelectToEndRef.current = false;
      didSelectToEndRef.current = false;
      mouseDownCellIdRef.current = currentId;
      mouseDownShiftRef.current = event.shiftKey;
      lastHoverIdRef.current = '';

      if (!event.shiftKey) {
        if (currentId.endsWith('footer')) {
          dragModeRef.current = 'footer';
          const sep = currentId.lastIndexOf('-');
          const id = currentId.slice(0, sep);
          anchorIdRef.current = `${id}-${rowIds[0]}`;
        } else {
          dragModeRef.current = 'cells';
          anchorIdRef.current = currentId;
        }

        setAnchorId(currentId);
      }

      isDraggingRef.current = true;
      setIsDragging(true);
    },
    [setAnchorId, setIsDragging, rowIds],
  );

  const handleMouseMove = useCallback(
    (currentId?: string) => {
      if (!isDraggingRef.current || !anchorIdRef.current || !currentId) {
        return;
      }

      if (currentId === anchorIdRef.current) return;

      didDragRef.current = true;
      if (dragModeRef.current === 'cells') {
        if (currentId === lastHoverIdRef.current) {
          return;
        }

        lastHoverIdRef.current = currentId;
        getCellIdsInRange({
          anchorId: anchorIdRef.current,
          currentId,
          rowIds: rowIdsRef.current,
          columnIds: tagColumnIdsRef.current,
          dispatch,
        });
      } else {
        const currentSep = currentId.lastIndexOf('-');
        const anchorSep = anchorIdRef.current.lastIndexOf('-');

        const currentColumnOrder = currentId.slice(0, currentSep);

        if (currentColumnOrder === lastHoverIdRef.current) {
          return;
        }

        lastHoverIdRef.current = currentColumnOrder;
        const anchorColumnOrder = anchorIdRef.current.slice(0, anchorSep);

        if (currentColumnOrder === 'allTags' || currentColumnOrder === 'allClaims') {
          const firstColumnOrder = tagColumnIdsRef.current[0];
          const isFromFirstColumn = Number(anchorColumnOrder) === firstColumnOrder;

          if (!pendingSelectToEndRef.current) {
            if (isFromFirstColumn) {
              const nextIds = new Set(selectionStore.getState().selectedIds);
              addSideIds(nextIds, rowIdsRef.current);
              dispatch({ type: 'set', ids: nextIds });
            }

            const anchorOrder = Number(anchorColumnOrder);
            requestAnimationFrame(() => {
              if (!pendingSelectToEndRef.current || didSelectToEndRef.current) return;
              const lastOrder = tagColumnIdsRef.current.at(-1);
              if (lastOrder == null || !Number.isFinite(anchorOrder)) return;
              didSelectToEndRef.current = true;
              selectColumnsRef.current({
                anchorColumnOrder: anchorOrder,
                currentColumnOrder: lastOrder,
              });
            });
          }

          pendingSelectToEndRef.current = true;
          return;
        }

        if (!Number.isFinite(Number(currentColumnOrder))) {
          if (pendingSelectToEndRef.current) {
            const nextIds = new Set(selectionStore.getState().selectedIds);
            removeSideIds(nextIds, rowIdsRef.current);
            dispatch({ type: 'set', ids: nextIds });
          }
          pendingSelectToEndRef.current = false;
          didSelectToEndRef.current = false;
          return;
        }
        pendingSelectToEndRef.current = false;
        didSelectToEndRef.current = false;
        selectColumns({
          anchorColumnOrder: Number(anchorColumnOrder),
          currentColumnOrder: Number(currentColumnOrder),
        });
      }
    },
    [selectColumns, dispatch],
  );

  useEffect(() => {
    window.addEventListener('mouseup', endDrag);
    return () => window.removeEventListener('mouseup', endDrag);
  }, [endDrag]);

  return {
    handleFooterCellClick,
    handleAllTagsCellClick,
    handleCellClick,
    handleMouseDown,
    handleMouseMove,
    handleFooterAlltagsCellClick,
  };
};
