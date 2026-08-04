import type { ColumnItem } from '../../types';

type TableRowProps<T> = {
  data: T;
  columns: ColumnItem<T>[];
};

export const TableRow = <T,>({ data, columns }: TableRowProps<T>) => (
  <tr>
    {columns.map((column) => {
      const value = column.dataIndex ? data[column.dataIndex] : '';
      return <td key={String(column.dataIndex)}>{String(value ?? '')}</td>;
    })}
  </tr>
);
