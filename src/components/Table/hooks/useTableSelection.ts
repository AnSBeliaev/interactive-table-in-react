import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useSelection } from '../../../constext';
import type { ColumnItem, TableRowItem, Tag } from '../types';
import { getCellIdsInRange, getNextAnchorId } from '../helpers';

type UseTableSelectionArgs<T> = {
  normalizedDocuments: (TableRowItem & {
    tagsByOrder: Tag[];
  })[];
  columns: (number | ColumnItem<T>)[];
};

export const useTableSelection = <T>({ normalizedDocuments, columns }: UseTableSelectionArgs<T>) => {
  const { selectedIds, dispatch, setAnchorId, anchorId, isDragging, setIsDragging } = useSelection();

  const rowIds = useMemo(() => normalizedDocuments?.map((document) => document.id), [normalizedDocuments]);
  const columnIds = useMemo(
    () => columns.map((column) => (typeof column === 'number' ? column : column.id)),
    [columns],
  );
  const tagColumnIds = useMemo(
    () => columns.filter((column): column is number => typeof column === 'number'),
    [columns],
  );

  const selectedIdsRef = useRef(selectedIds);
  const anchorIdRef = useRef(anchorId);
  const isDraggingRef = useRef(isDragging);
  const rowIdsRef = useRef(rowIds);
  const columnIdsRef = useRef(columnIds);
  const tagColumnIdsRef = useRef(tagColumnIds);
  const didDragRef = useRef(false);
  const mouseDownCellIdRef = useRef('');
  const mouseDownShiftRef = useRef(false);

  useLayoutEffect(() => {
    selectedIdsRef.current = selectedIds;
    anchorIdRef.current = anchorId;
    isDraggingRef.current = isDragging;
    rowIdsRef.current = rowIds;
    columnIdsRef.current = columnIds;
    tagColumnIdsRef.current = tagColumnIds;
  }, [selectedIds, anchorId, isDragging, rowIds, columnIds, tagColumnIds]);

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
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => {
      const sep = cellId.lastIndexOf('-');
      const numericRowId = Number(sep === -1 ? cellId : cellId.slice(sep + 1));
      if (!Number.isFinite(numericRowId)) return;

      const columnIds = columnIdsRef.current ?? [];
      if (columnIds.length === 0) return;

      const idsForThisRowArray = columnIds.map((columnId) => `${columnId}-${numericRowId}`);
      const idsForThisRowSet = new Set<string>(idsForThisRowArray);
      const selectedIdsNow = selectedIdsRef.current;
      const isRowFullySelected = idsForThisRowArray.every((id) => selectedIdsNow.has(id));

      if (event.ctrlKey || event.metaKey) {
        const currentAnchorId = anchorIdRef.current;
        const rowHasAnchor = Boolean(currentAnchorId && idsForThisRowSet.has(currentAnchorId));

        if (isRowFullySelected) {
          if (rowHasAnchor) return;

          const nextIds = new Set(selectedIdsNow);
          idsForThisRowArray.forEach((id) => nextIds.delete(id));
          dispatch({ type: 'set', ids: nextIds });
        } else {
          const nextIds = new Set(selectedIdsNow);
          idsForThisRowArray.forEach((id) => nextIds.add(id));
          dispatch({ type: 'set', ids: nextIds });

          const nextAnchorId = `${columnIds[0]}-${numericRowId}`;
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
          for (const order of columnIds) {
            rangeIds.add(`${order}-${rowIdInRange}`);
          }
        }

        dispatch({ type: 'set', ids: rangeIds });
        return;
      }

      dispatch({ type: 'set', ids: idsForThisRowSet });

      const nextAnchorId = `${columnIds[0]}-${numericRowId}`;
      anchorIdRef.current = nextAnchorId;
      setAnchorId(nextAnchorId);
    },
    [dispatch, setAnchorId],
  );

  const handleFooterAlltagsCellClick = useCallback(() => {
    dispatch({ type: 'clear' });
  }, [dispatch]);

  const handleFooterCellClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, columnOrder: string) => {
      const numericColumnOrder = Number(columnOrder);
      if (!Number.isFinite(numericColumnOrder)) return;

      const rowIds = rowIdsRef.current ?? [];
      const tagColumnIds = tagColumnIdsRef.current ?? [];
      if (rowIds.length === 0 || tagColumnIds.length === 0) return;

      const idsForThisColumnArr = rowIds.map((rowId) => `${numericColumnOrder}-${rowId}`);
      const idsForThisColumnSet = new Set<string>(idsForThisColumnArr);
      const selectedIdsNow = selectedIdsRef.current;
      const isColumnFullySelected = idsForThisColumnArr.every((id) => selectedIdsNow.has(id));

      if (event.ctrlKey || event.metaKey) {
        const currentAnchorId = anchorIdRef.current;
        const columnHasAnchor = Boolean(currentAnchorId && idsForThisColumnSet.has(currentAnchorId));

        if (isColumnFullySelected) {
          if (columnHasAnchor) return;

          const nextIds = new Set(selectedIdsNow);
          idsForThisColumnArr.forEach((id) => nextIds.delete(id));
          dispatch({ type: 'set', ids: nextIds });
        } else {
          const nextIds = new Set(selectedIdsNow);
          idsForThisColumnArr.forEach((id) => nextIds.add(id));
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

        const c1 = tagColumnIds.indexOf(anchorColumnOrder);
        const c2 = tagColumnIds.indexOf(numericColumnOrder);
        if (c1 === -1 || c2 === -1) return;

        const colStart = Math.min(c1, c2);
        const colEnd = Math.max(c1, c2);

        const rangeIds = new Set<string>();
        for (let c = colStart; c <= colEnd; c++) {
          const order = tagColumnIds[c];
          for (const rowId of rowIds) {
            rangeIds.add(`${order}-${rowId}`);
          }
        }

        dispatch({ type: 'set', ids: rangeIds });
        return;
      }

      dispatch({ type: 'set', ids: idsForThisColumnSet });

      const nextAnchorId = `${numericColumnOrder}-${rowIds[0]}`;
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

  const handleMouseDown = useCallback(
    (event: React.MouseEvent, currentId?: string) => {
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
    (currentId?: string) => {
      if (!isDraggingRef.current || !anchorIdRef.current || !currentId) {
        return;
      }

      if (currentId === anchorIdRef.current) return;

      didDragRef.current = true;
      getCellIdsInRange({
        anchorId: anchorIdRef.current,
        currentId,
        rowIds: rowIdsRef.current,
        columnIds: tagColumnIdsRef.current,
        dispatch,
      });
    },
    [dispatch],
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
