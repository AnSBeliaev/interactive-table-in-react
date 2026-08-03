import type { ColumnItem, TableRowItem } from '../../types';

type TableRowProps = {
  data: TableRowItem;
  columns: ColumnItem[];
};

export const TableRow = ({ data, columns }: TableRowProps) => {
  return (
    <tr>
      {columns.map((column) => {
        return <td key={column.dataIndex}>{column.dataIndex ? data[column.dataIndex] : ''}</td>;
      })}
    </tr>
  );
};
