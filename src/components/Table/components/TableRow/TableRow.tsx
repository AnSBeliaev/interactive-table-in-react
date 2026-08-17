import { memo } from 'react';
import type { TableColumn, TableRowItem } from '../../types';
import styles from './TableRow.module.css';
import { TableCell } from '../TableCell';

type TableRowProps<T> = {
  data: T;
  columns?: TableColumn[];
  getCellBackground?: ({ value }: { value: string }) => string;
  handleCellClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => void;
  handleMouseDown?: (event: React.MouseEvent<Element, MouseEvent>, currentId?: string) => void;
  handleMouseMove?: (currentId?: string) => void;
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
        {columns?.map((column) => {
          const cellId = typeof column === 'number' ? `${column}-${data.id}` : `${column.id}-${data.id}`;
          const isTag = typeof column === 'number';
          const hasInnerBackground = typeof column === 'number' || column.id === 'allTags';
          let value;

          if (typeof column !== 'number') {
            if (column.dataIndex) {
              value = data[column.dataIndex as keyof T];
            } else {
              value = '';
            }
          } else {
            value = data.tagsByOrder?.get(column)?.allExcerpt ?? '';
          }

          return (
            <TableCell
              key={isTag ? column : column.id}
              value={value}
              cellId={cellId}
              column={column}
              isSelected={Boolean(selectedCellIds?.has(cellId))}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              getCellBackground={getCellBackground}
              handleCellClick={handleCellClick}
              hasInnerBackground={hasInnerBackground}
            />
          );
        })}
      </div>
    );
  },
);
