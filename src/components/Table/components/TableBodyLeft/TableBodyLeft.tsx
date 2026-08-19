import { memo } from 'react';
import type { ColumnItem, TableRowItem } from '../../types';
import { TableRow } from '../TableRow';
import styles from './TableBodyLeft.module.css';

type TableBodyLeftArgs = {
  tableData: TableRowItem[];
  leftColumns: ColumnItem[];
};

export const TableBodyLeft = memo(({ tableData, leftColumns }: TableBodyLeftArgs) => {
  return (
    <div className={styles['table-body-left']}>
      {tableData?.map((tableRowItem: TableRowItem) => {
        return <TableRow key={tableRowItem.id} data={tableRowItem} columns={leftColumns} />;
      })}
    </div>
  );
});
