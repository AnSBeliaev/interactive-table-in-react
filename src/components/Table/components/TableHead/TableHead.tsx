import styles from './TableHead.module.css';

type TableHeadProps = {
  item: string;
  tagColor?: string;
  className: string;
};

export const TableHead = (props: TableHeadProps) => {
  return (
    <div
      title={props.item}
      className={`${styles[`head-td`]} ${styles[`head-${props.className}`]} ${Number(props.item) ? styles['head-td-tag'] : ''}`}
    >
      <div style={{ backgroundColor: props.tagColor }}>{props.item}</div>
    </div>
  );
};
