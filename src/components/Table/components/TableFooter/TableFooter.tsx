import styles from './TableFooter.module.css';

type TableFooterProps = {
  value?: string | number | null;
  className: string;
};

export const TableFooter = ({ value, className }: TableFooterProps) => {
  console.log('className >>>', className);
  return <div className={`${styles['footer-td']} ${styles[`footer-${className}`]}`}>{value ?? ''}</div>;
};
