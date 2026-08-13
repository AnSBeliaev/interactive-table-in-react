import { useSelection } from '../../../../constext';
import styles from './TableFooterCell.module.css';

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

export const TableFooterCell = ({
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
  const currentColumnId = columnId != undefined ? String(columnId) : '';
  const isSelected = selectedIds.has(`${currentColumnId}-footer`);
  return (
    <div
      className={`${styles['footer-td']} ${styles[`footer-${className}`]} ${isSelected ? styles['footer-cell-selected-tag'] : ''}`}
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
};
