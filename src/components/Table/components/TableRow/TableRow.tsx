import type { TableColumn, TableRowItem } from '../../types';
import styles from './TableRow.module.css';

type TableRowProps<T> = {
  data: T;
  columns: TableColumn<T>[];
  getCellBackground?: ({ value }: { value: string }) => string;
};

export const TableRow = <T extends TableRowItem>({ data, columns, getCellBackground }: TableRowProps<T>) => {
  return (
    <div className={styles['table-row']}>
      {columns.map((column) => {
        const isTag = typeof column === 'number';
        const hasInnerBackground = isTag || column.id === 'allTags';

        const value =
          typeof column !== 'number'
            ? column.dataIndex
              ? data[column.dataIndex]
              : ''
            : data.tagsByOrder?.[column]?.allExcerpt;

        return (
          <div key={isTag ? column : column.id} className={styles[`table-cell-${isTag ? 'tag' : String(column.id)}`]}>
            <div
              className={styles[`${hasInnerBackground ? 'inner-table-cell' : ''}`]}
              style={{
                backgroundColor: `${getCellBackground ? `${getCellBackground({ value: String(value) })}` : ''}`,
              }}
            >
              {value ? String(value) : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
};
