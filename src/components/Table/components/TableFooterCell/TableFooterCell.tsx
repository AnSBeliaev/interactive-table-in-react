import { useSelection } from '../../../../constext';
import styles from './TableFooterCell.module.css';

type TableFooterProps = {
  value?: string | number | null;
  className: string;
  columnId?: number;
  isTableTag?: boolean;
  getCellBackground?: ({ value }: { value: string }) => string;
  onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => void) | null;
};

export const TableFooterCell = ({
  value,
  className,
  isTableTag,
  getCellBackground,
  onClick,
  columnId,
}: TableFooterProps) => {
  const { selectedIds } = useSelection();
  const currentColumnId = columnId ? String(columnId) : '';
  const isSelected = selectedIds.has(`${currentColumnId}-footer`);
  return (
    <div
      className={`${styles['footer-td']} ${styles[`footer-${className}`]} ${isSelected ? styles['footer-cell-selected-tag'] : ''}`}
      onClick={(event) => onClick?.(event, currentColumnId)}
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
