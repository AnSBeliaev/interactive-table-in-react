import type { TableColumn, TableRowItem } from '../../types';
import styles from './TableRow.module.css';

type TableRowProps<T> = {
  data: T;
  columns: TableColumn<T>[];
};

export const TableRow = <T extends TableRowItem>({ data, columns }: TableRowProps<T>) => {
  return (
    <div className={styles['table-row']}>
      {columns.map((column) => {
        const cellValue =
          typeof column !== 'number'
            ? column.dataIndex
              ? data[column.dataIndex]
              : ''
            : data.tagsByOrder?.[column]?.allExcerpt;
        return (
          <div
            key={typeof column === 'number' ? column : column.id}
            className={styles[`table-cell-${typeof column !== 'number' ? String(column.id) : 'tag'}`]}
          >
            {cellValue ? String(cellValue) : ''}
          </div>
        );
      })}
    </div>
  );
};
