import { memo } from 'react';
import styles from './TableFooterCell.module.css';
import { useSelection } from '../../../../constext';

type TableFooterProps = {
  value?: string | number | null;
  className: string;
  columnId?: number | string;
  isTableTag?: boolean;
  getCellBackground?: ({ value }: { value: string }) => string;
  onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => void) | null;
  onMouseMove?: (currentId?: string | undefined) => void;
  onMouseDown?: (event: React.MouseEvent<Element, MouseEvent>, currentId?: string) => void;
};

export const TableFooterCell = memo(
  ({
    value,
    className,
    isTableTag,
    getCellBackground,
    onClick,
    onMouseMove,
    onMouseDown,
    columnId,
  }: TableFooterProps) => {
    const { selectedIds } = useSelection();
    const isSelected = selectedIds.has(`${columnId}-footer`);
    const currentColumnId = columnId != undefined ? String(columnId) : '';
    return (
      <div
        data-selected={isSelected}
        className={`${styles['footer-td']} ${styles[`footer-${className}`]} ${styles['footer-cell']}`}
        onClick={(event) => onClick?.(event, currentColumnId)}
        onMouseMove={() => onMouseMove?.(`${currentColumnId}-footer`)}
        onMouseDown={(event) => onMouseDown?.(event, `${currentColumnId}-footer`)}
      >
        <div
          className={isTableTag ? `${styles['inner-footer-cell']}` : ''}
          style={{
            backgroundColor: `${getCellBackground ? `${getCellBackground({ value: String(value) })}` : ''}`,
          }}
        >
          <p>{value ?? ''}</p>
        </div>
      </div>
    );
  },
);
