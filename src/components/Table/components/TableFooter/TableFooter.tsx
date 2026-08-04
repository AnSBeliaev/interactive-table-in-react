import type { ColumnItem } from '../../types';
import styles from './TableFooter.module.css';

type TableRow = {
  allExcerptSums: { [order: number]: number };
  allTagsSum: number;
  columns: (number | ColumnItem)[];
};

export const TableFooter = ({ allExcerptSums, allTagsSum, columns }: TableRow) => {
  return (
    <tr>
      <td colSpan={2} className={styles['all-documents-td']}>
        All documents
      </td>
      {columns.map((column, index) => {
        if (index == 0 || index === 1) return null;
        const cellValue =
          typeof column !== 'number' ? (column.dataIndex === 'allTags' ? allTagsSum : '') : allExcerptSums[column];
        return (
          <td
            key={typeof column !== 'number' ? column.dataIndex : column}
            className={styles[`footer-${typeof column !== 'number' ? 'td' : 'tag'}`]}
          >
            {cellValue}
          </td>
        );
      })}
    </tr>
  );
};
