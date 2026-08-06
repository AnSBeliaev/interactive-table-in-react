import type { TableColumn, TableRowItem } from '../../types';
import styles from './TableRow.module.css';

type TableRowProps<T> = {
  data: T;
  columns: TableColumn<T>[];
  minAllExcerpt?: string | null;
  maxAllExcerpt?: string | null;
};

export const TableRow = <T extends TableRowItem>({ data, columns, minAllExcerpt, maxAllExcerpt }: TableRowProps<T>) => {
  function getPercentage(min: number, max: number, current: number) {
    if (current < min) return '00';
    if (current >= max) return '';

    const progress = (current - min) / (max - min);

    const percent = 15 + progress * (100 - 5);
    const percentage = Math.round(percent / 5) * 5;
    if (percentage === 100) return '';
    return String(percentage);
  }

  return (
    <div className={styles['table-row']}>
      {columns.map((column) => {
        let currentOpacity: string | null = null;
        const isTag = typeof column === 'number';
        const hasInnerBackground = typeof column === 'number' || column.id === 'allTags';
        const isTableTag = isTag && data.tagsByOrder?.[column]?.allExcerpt;
        const cellValue =
          typeof column !== 'number'
            ? column.dataIndex
              ? data[column.dataIndex]
              : ''
            : data.tagsByOrder?.[column]?.allExcerpt;

        if ((isTag && data.tagsByOrder?.[column]?.allExcerpt) || hasInnerBackground) {
          currentOpacity = getPercentage(Number(minAllExcerpt), Number(maxAllExcerpt), Number(cellValue));
        }

        return (
          <div
            key={typeof column === 'number' ? column : column.id}
            className={styles[`table-cell-${isTag ? 'tag' : String(column.id)}`]}
          >
            <div
              className={styles[`${hasInnerBackground ? 'inner-table-cell' : ''}`]}
              style={{
                backgroundColor: `${isTableTag || hasInnerBackground ? `${currentOpacity ? `#66b8ee${currentOpacity}` : '#66b8ee'}` : ''}`,
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
