import { TableRow } from './components';
import { TableHead } from './components';

import type { ColumnItem, TableRowItem } from './types';

type TableProps<T> = {
  data: T[];
  columns: ColumnItem<T>[];
};

export const Table = (props: TableProps<TableRowItem>) => {
  return (
    <table>
      <thead>
        <tr>
          {props.columns.map((headItem: ColumnItem<TableRowItem>) => {
            return <TableHead key={headItem.dataIndex} item={headItem.title} />;
          })}
        </tr>
      </thead>
      <tbody>
        {props.data?.map((tableRowItem: TableRowItem) => {
          return <TableRow key={tableRowItem.id} data={tableRowItem} columns={props.columns} />;
        })}
      </tbody>
    </table>
  );
};
