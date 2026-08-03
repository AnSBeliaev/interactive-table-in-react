import type { ColumnItem, TableRowItem } from '../../types';

type TableRowProps = {
  data: TableRowItem;
  columns: ColumnItem[];
};

export const TableRow = ({ data, columns }: TableRowProps) => (
  <tr>
    {columns.map((column) => (
      <td key={column.dataIndex}>{column.dataIndex ? data[column.dataIndex] : ''}</td>
    ))}
  </tr>
);
