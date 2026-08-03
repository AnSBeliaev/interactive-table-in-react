import type { ColumnItem, TableRowItem, Tag } from '../../types';
import styles from './TableRow.module.css';

type NormalisedTableRowItem = TableRowItem & { tagsByOrder?: Tag[] };
type TableRow = {
  data: NormalisedTableRowItem & { view?: string };
  columns: (number | ColumnItem)[];
};

export const TableRow = ({ data, columns }: TableRow) => {
  return (
    <tr>
      {columns.map((column) => {
        const cellValue =
          typeof column !== 'number'
            ? column.dataIndex
              ? data[column.dataIndex]
              : ''
            : data.tagsByOrder?.[column]?.order;
        return (
          <td
            key={typeof column !== 'number' ? column.dataIndex : column}
            className={styles[`cell-${typeof column !== 'number' ? column.dataIndex : column}`]}
          >
            {cellValue}
          </td>
        );
      })}
    </tr>
  );
};
