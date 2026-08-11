import { memo } from 'react';
import type { TableColumn, TableRowItem } from '../../types';
import styles from './TableRow.module.css';

type TableRowProps<T> = {
  data: T;
  columns: TableColumn<T>[];
  getCellBackground?: ({ value }: { value: string }) => string;
  handleCellClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => void;
  handleMouseDown?: (event: React.MouseEvent<Element, MouseEvent>, currentId: string) => void;
  handleMouseMove?: (currentId: string) => void;
  selectedCellIds?: ReadonlySet<string>;
};

export const TableRow = memo(
  <T extends TableRowItem>({
    data,
    columns,
    getCellBackground,
    handleCellClick,
    handleMouseDown,
    handleMouseMove,
    selectedCellIds,
  }: TableRowProps<T>) => {
    return (
      <div className={styles['table-row']}>
        {columns.map((column) => {
          let cellId = '';
          if (typeof column === 'number') {
            cellId = `${column}-${data.id}`;
          }
          if (typeof column !== 'number' && column.id === 'allTags') {
            cellId = `${data.id}`;
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
                selectedCellIds?.has(cellId) ? styles['table-cell-selected-tag'] : ''
              }`}
              onClick={(event) => {
                if (!handleCellClick) return;
                if (typeof column !== 'number' && column.id !== 'allTags') return;
                if (!cellId) return;
                handleCellClick(event, cellId);
              }}
              onMouseDown={(event) => handleMouseDown?.(event, cellId)}
              onMouseMove={() => handleMouseMove?.(cellId)}
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
