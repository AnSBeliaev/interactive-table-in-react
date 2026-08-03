import styles from './TableHead.module.css';

type TableHeadProps = {
  item: string;
};

export const TableHead = (props: TableHeadProps) => {
  return (
    <td title={props.item} className={styles['head-td']}>
      {props.item}
    </td>
  );
};
