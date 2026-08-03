import type { TagsForHeader } from '../../types';
import styles from './TableHead.module.css';

type TableHeadProps = {
  item: string;
  tagsColor?: TagsForHeader[];
};

export const TableHead = (props: TableHeadProps) => {
  return (
    <td title={props.item} className={`${styles['head-td']} ${Number(props.item) ? styles['tag-head-td'] : ''}`}>
      <div style={{ backgroundColor: props.tagsColor?.[0].color }}>{props.item}</div>
    </td>
  );
};
