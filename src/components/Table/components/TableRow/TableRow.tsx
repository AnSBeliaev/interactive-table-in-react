import { memo, useRef } from 'react';
import { useSelection } from '../../../../constext';
import type { TableColumn, TableRowItem } from '../../types';
import styles from './TableRow.module.css';
import { getCellIdsInRange } from './helpers';

type TableRowProps<T> = {
  data: T;
  columns: TableColumn<T>[];
  rowIds?: number[];
  getCellBackground?: ({ value }: { value: string }) => string;
};

export const TableRow = memo(
  <T extends TableRowItem>({ data, columns, getCellBackground, rowIds }: TableRowProps<T>) => {
    const { selectedIds, dispatch, setAnchorId, anchorId, isDragging, setIsDragging } = useSelection();
    const didDragRef = useRef(false);
    const columnIds = columns.filter((column) => typeof column === 'number');

    const handleCellClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => {
      if (!cellId) return;
      if (didDragRef.current) {
        didDragRef.current = false;
        return;
      }

      if (event.shiftKey && anchorId) {
        getCellIdsInRange({ anchorId, currentId: cellId, rowIds, columnIds, dispatch });
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        if (selectedIds.has(cellId)) {
          dispatch({ type: 'remove', id: cellId });
        } else {
          dispatch({ type: 'add', id: cellId });
        }
        setAnchorId(cellId);
        return;
      }

      if (selectedIds.has(cellId) && selectedIds.size === 1) {
        dispatch({ type: 'remove', id: cellId });
      } else if (selectedIds.has(cellId) && selectedIds.size > 1) {
        dispatch({ type: 'clear' });
        dispatch({ type: 'add', id: cellId });
      } else {
        dispatch({ type: 'clear' });
        dispatch({ type: 'add', id: cellId });
      }
      setAnchorId(cellId);
    };

    const handleMouseDown = (event: React.MouseEvent, currentId: string) => {
      if (!currentId || event.ctrlKey || event.metaKey || event.shiftKey) return;
      didDragRef.current = false;
      setAnchorId(currentId);
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      didDragRef.current = false;
      setIsDragging(false);
    };

    const handleMouseMove = (currentId: string) => {
      if (!isDragging || !anchorId || !currentId) return;
      didDragRef.current = true;
      getCellIdsInRange({ anchorId, currentId, rowIds, columnIds, dispatch });
    };
    return (
      <div className={styles['table-row']}>
        {columns.map((column) => {
          let cellId = '';
          if (typeof column === 'number') {
            cellId = `${column}-${data.id}`;
          }

          const isTag = typeof column === 'number';
          const hasInnerBackground = isTag || column.id === 'allTags';

          const value =
            typeof column !== 'number'
              ? column.dataIndex
                ? data[column.dataIndex]
                : ''
              : data.tagsByOrder?.[column]?.allExcerpt;

          return (
            <div
              key={isTag ? column : column.id}
              className={`${styles[`table-cell-${isTag ? 'tag' : column.id}`]} ${
                selectedIds.has(cellId) ? styles['table-cell-selected-tag'] : ''
              }`}
              onClick={(event) => handleCellClick(event, cellId)}
              onMouseDown={(event) => handleMouseDown(event, cellId)}
              onMouseUp={handleMouseUp}
              onMouseMove={() => handleMouseMove(cellId)}
            >
              <div
                className={styles[`${hasInnerBackground ? 'inner-table-cell' : ''}`]}
                style={{
                  backgroundColor: `${getCellBackground ? `${getCellBackground({ value: String(value) })}` : ''}`,
                }}
              >
                <p>{value ? String(value) : ''}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
