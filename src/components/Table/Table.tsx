import { TableRow } from './components';
import { TableHead } from './components';
import { STATIC_COLUMNS } from './constants/columns';
import type { ColumnItem, TableData, TableRowItem } from './types';

type TableProps = {
  data: TableData;
};

export const Table = (props: TableProps) => {
  return (
    <table>
      <thead>
        <tr>
          {STATIC_COLUMNS.map((headItem: ColumnItem) => {
            return <TableHead key={headItem.dataIndex} item={headItem.title} />;
          })}
        </tr>
      </thead>
      <tbody>
        {props.data.documents?.map((tableRowItem: TableRowItem) => {
          return <TableRow key={tableRowItem.id} data={tableRowItem} columns={STATIC_COLUMNS} />;
        })}
      </tbody>
    </table>
  );
};
