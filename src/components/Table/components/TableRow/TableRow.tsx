import { getPercentage } from '../../helpers';
import type { TableColumn, TableRowItem } from '../../types';
import styles from './TableRow.module.css';

type TableRowProps<T> = {
  data: T;
  columns: TableColumn<T>[];
  minAllExcerpt?: number | null;
  maxAllExcerpt?: number | null;
};

export const TableRow = <T extends TableRowItem>({ data, columns, minAllExcerpt, maxAllExcerpt }: TableRowProps<T>) => {
  return (
    <div className={styles['table-row']}>
      {columns.map((column) => {
        let percent: number | null = null;
        const isTag = typeof column === 'number';
        const hasInnerBackground = typeof column === 'number' || column.id === 'allTags';
        const isTableTag = isTag && data.tagsByOrder?.[column]?.allExcerpt;
        const cellValue =
          typeof column !== 'number'
            ? column.dataIndex
              ? data[column.dataIndex]
              : ''
            : data.tagsByOrder?.[column]?.allExcerpt;

        const current = Number(cellValue);
        const min = Number(minAllExcerpt);
        const max = Number(maxAllExcerpt);
        const canColor =
          current > 0 &&
          cellValue !== '' &&
          cellValue != null &&
          Number.isFinite(current) &&
          Number.isFinite(min) &&
          Number.isFinite(max) &&
          max > min;

        if (((isTag && data.tagsByOrder?.[column]?.allExcerpt) || hasInnerBackground) && canColor) {
          percent = getPercentage({
            min,
            max,
            current,
          });
        }

        return (
          <div
            key={typeof column === 'number' ? column : column.id}
            className={styles[`table-cell-${isTag ? 'tag' : String(column.id)}`]}
          >
            <div
              className={styles[`${hasInnerBackground ? 'inner-table-cell' : ''}`]}
              style={{
                backgroundColor: `${isTableTag || hasInnerBackground ? `${percent ? `rgba(102, 184, 238, ${percent / 100})` : ''}` : ''}`,
              }}
            >
              {cellValue ? String(cellValue) : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
};
