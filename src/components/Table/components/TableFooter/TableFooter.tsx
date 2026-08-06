import styles from './TableFooter.module.css';

type TableFooterProps = {
  value?: string | number | null;
  className: string;
  isFullColoredTag?: boolean;
  isTableTag?: boolean;
};

export const TableFooter = ({ value, className, isFullColoredTag, isTableTag }: TableFooterProps) => {
  return (
    <div className={`${styles['footer-td']} ${styles[`footer-${className}`]}`}>
      <div
        className={`${styles[isTableTag || isFullColoredTag ? 'inner-footer-cell' : '']}`}
        style={{
          backgroundColor: `${isFullColoredTag ? `rgba(102, 184, 238, 1)` : ''}`,
        }}
      >
        {value ?? ''}
      </div>
    </div>
  );
};
