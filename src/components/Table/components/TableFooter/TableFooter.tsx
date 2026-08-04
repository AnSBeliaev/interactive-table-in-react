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
      {columns.map((column) => {
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
