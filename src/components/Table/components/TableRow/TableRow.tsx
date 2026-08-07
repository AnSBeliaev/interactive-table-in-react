import { useSelection } from '../../../../constext';
import type { TableColumn, TableRowItem } from '../../types';
import styles from './TableRow.module.css';

type TableRowProps<T> = {
  data: T;
  columns: TableColumn<T>[];
  rowIds?: number[];
  getCellBackground?: ({ value }: { value: string }) => string;
};

export const TableRow = <T extends TableRowItem>({ data, columns, getCellBackground, rowIds }: TableRowProps<T>) => {
  const { selectedIds, dispatch, setAnchorId, anchorId, isDragging, setIsDragging } = useSelection();

  const handleCellClick = (cellId: string) => {
    dispatch({
      type: 'add',
      id: cellId,
    });
    if (selectedIds.has(cellId)) {
      dispatch({
        type: 'remove',
        id: cellId,
      });
    }
  };

  const columnIds = columns.filter((column) => typeof column === 'number');

  type GetCellIdsInRangeArgs = { anchorId: string; currentId: string; rowIds?: number[]; columnIds: number[] };

  const getCellIdsInRange = ({ anchorId, currentId, rowIds, columnIds }: GetCellIdsInRangeArgs) => {
    if (!rowIds) return;
    const sep = anchorId.lastIndexOf('-');
    const anchorColumnId = anchorId.slice(0, sep);
    const anchorRowId = anchorId.slice(sep + 1);
    const currentColumnId = currentId.slice(0, sep);
    const currentRowId = currentId.slice(sep + 1);
    const selectedIdsSet = new Set<string>();

    const r1 = rowIds.indexOf(Number(anchorRowId));
    const r2 = rowIds.indexOf(Number(currentRowId));
    const c1 = columnIds.indexOf(Number(anchorColumnId));
    const c2 = columnIds.indexOf(Number(currentColumnId));
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
      for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
        selectedIdsSet.add(`${columnIds[c]}-${rowIds[r]}`);
      }
    }

    dispatch({
      type: 'set',
      ids: selectedIdsSet,
    });
  };

  const handleMouseDown = (currentId: string) => {
    setAnchorId(currentId);
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (currentId: string) => {
    if (isDragging) {
      getCellIdsInRange({ anchorId, currentId, rowIds, columnIds });
    }
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
            onClick={() => handleCellClick(cellId)}
            onMouseDown={() => handleMouseDown(cellId)}
            onMouseUp={handleMouseUp}
            onMouseMove={() => handleMouseMove(cellId)}
          >
            <div
              className={styles[`${hasInnerBackground ? 'inner-table-cell' : ''}`]}
              style={{
                backgroundColor: `${getCellBackground ? `${getCellBackground({ value: String(value) })}` : ''}`,
              }}
            >
              {value ? String(value) : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
};
