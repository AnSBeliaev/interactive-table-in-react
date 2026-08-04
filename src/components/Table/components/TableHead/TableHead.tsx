import styles from './TableHead.module.css';

type TableHeadProps = {
  item: string;
  tagColor?: string;
};

export const TableHead = (props: TableHeadProps) => {
  return (
    <div title={props.item} className={`${styles['head-td']} ${Number(props.item) ? styles['tag-head-td'] : ''}`}>
      <div style={{ backgroundColor: props.tagColor }}>{props.item}</div>
    </div>
  );
};
