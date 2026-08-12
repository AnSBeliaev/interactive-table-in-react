import styles from './TableFooter.module.css';

type TableFooterProps = {
  value?: string | number | null;
  className: string;
  columnId?: number;
  isTableTag?: boolean;
  getCellBackground?: ({ value }: { value: string }) => string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => void;
};

export const TableFooter = ({
  value,
  className,
  isTableTag,
  getCellBackground,
  onClick,
  columnId,
}: TableFooterProps) => {
  const currentColumnId = columnId ? String(columnId) : '';
  return (
    <div
      className={`${styles['footer-td']} ${styles[`footer-${className}`]}`}
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
