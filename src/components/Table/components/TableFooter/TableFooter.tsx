import styles from './TableFooter.module.css';

type TableFooterProps = {
  value?: string | number | null;
  className: string;
  isTableTag?: boolean;
  getCellBackground?: ({ value }: { value: string }) => string;
};

export const TableFooter = ({ value, className, isTableTag, getCellBackground }: TableFooterProps) => {
  return (
    <div className={`${styles['footer-td']} ${styles[`footer-${className}`]}`}>
      <div
        className={isTableTag ? `${styles['inner-footer-cell']}` : ''}
        style={{
          backgroundColor: `${getCellBackground ? `${getCellBackground({ value: String(value) })}` : ''}`,
        }}
      >
        {value ?? ''}
      </div>
    </div>
  );
};
