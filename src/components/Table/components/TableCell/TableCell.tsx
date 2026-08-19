import { memo } from 'react';
import styles from './TableCell.module.css';

type TableCellColumn = number | { id: string | number };

type TableCellProps = {
  isSelected?: boolean;
  cellId?: string;
  column: TableCellColumn;
  value?: unknown;
  hasInnerBackground: boolean;
  handleCellClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => void;
  handleMouseDown?: (event: React.MouseEvent<Element, MouseEvent>, currentId?: string) => void;
  handleMouseMove?: (currentId?: string) => void;
  getCellBackground?: ({ value }: { value: string }) => string;
};

export const TableCell = memo(
  ({
    value,
    cellId,
    column,
    isSelected,
    handleMouseDown,
    handleMouseMove,
    getCellBackground,
    handleCellClick,
    hasInnerBackground,
  }: TableCellProps) => {
    const isTag = typeof column === 'number';
    const columnClassName = isTag ? 'tag' : column.id;

    return (
      <div
        data-selected={isSelected}
        className={`${styles[`table-cell-${columnClassName}`]} ${styles['cell']}`}
        onClick={(event) => {
          if (!handleCellClick) return;
          if (!isTag && column.id !== 'allTags' && column.id !== 'allClaims') return;
          if (!cellId) return;
          handleCellClick(event, cellId);
        }}
        onMouseDown={(event) => handleMouseDown?.(event, cellId)}
        onMouseMove={() => handleMouseMove?.(cellId)}
      >
        <div
          className={styles[`${hasInnerBackground ? 'inner-table-cell' : ''}`]}
          style={{
            backgroundColor: getCellBackground ? getCellBackground({ value: String(value) }) : undefined,
          }}
        >
          <p>{value ? String(value) : ''}</p>
        </div>
      </div>
    );
  },
);
