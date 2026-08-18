import { memo, useMemo } from 'react';
import type { TableColumn, TableRowItem } from '../../types';
import styles from './TableRow.module.css';
import { TableCell } from '../TableCell';

type TableRowProps<T> = {
  isMid?: boolean;
  data: T;
  columns?: TableColumn[];
  isBigData?: boolean;
  getCellBackground?: ({ value }: { value: string }) => string;
  handleCellClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => void;
  handleMouseDown?: (event: React.MouseEvent<Element, MouseEvent>, currentId?: string) => void;
  handleMouseMove?: (currentId?: string) => void;
  selectedCellIds?: ReadonlySet<string>;
};

export const TableRow = memo(
  <T extends TableRowItem>({
    data,
    isMid,
    columns,
    isBigData = false,
    getCellBackground,
    handleCellClick,
    handleMouseDown,
    handleMouseMove,
    selectedCellIds,
  }: TableRowProps<T>) => {
    const tableCellsData = useMemo(() => new Map(data.claims?.map((claim) => [claim.order, claim])), [data.claims]);

    return (
      <div className={styles['table-row']}>
        {columns?.map((column) => {
          const cellValue = typeof column === 'number' ? tableCellsData.get(column) : undefined;

          const cellId = typeof column === 'number' ? `${column}-${data.id}` : `${column.id}-${data.id}`;
          const isTag = typeof column === 'number';
          const hasInnerBackground = typeof column === 'number' || column.id === 'allTags' || column.id === 'allClaims';
          let value: unknown = '';

          if (typeof column === 'number') {
            if (isBigData) {
              value = isMid ? cellValue?.allExcerpts : '';
            } else {
              value = data.tagsByOrder?.get(column)?.allExcerpt ?? '';
            }
          } else {
            if (column.dataIndex) {
              value = data[column.dataIndex as keyof T];
            }
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
