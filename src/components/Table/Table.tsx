import { TableRow } from './components';
import { TableHead } from './components';
import { STATIC_COLUMNS as staticColumns } from './constants/columns';

import styles from './Table.module.css';

import type { TableData, TableRowItem, Tag } from './types';

type TableProps = {
  data: TableData;
};

const isTag = (value: string | number | Tag | null): value is Tag => {
  return Boolean(value && typeof value === 'object' && 'allExcerpt' in value);
};

type NormalisedTableRowItem = TableRowItem & { tagsByOrder?: Tag[] };

export const Table = ({ data }: TableProps) => {
  const normalizedDocuments: NormalisedTableRowItem[] = data.documents.map((document) => {
    const tagsByOrder: Tag[] = [];
    const documentEntries: [string, string | number | Tag | null][] = Object.entries(document);

    documentEntries.forEach((item) => {
      const value = item[1];
      if (isTag(value)) {
        tagsByOrder.push(value);
      }
    });

    return {
      ...document,
      tagsByOrder: [...tagsByOrder],
    };
  });

  const dynamicColumns = data.tagsForHeader.map((tag) => {
    return tag.order;
  });
  const allColumns = [...staticColumns, ...dynamicColumns];
  return (
    <div className={styles['table-container']}>
      <table>
        <thead>
          <tr>
            {allColumns.map((headItem) => {
              if (typeof headItem === 'number') {
                return <TableHead key={headItem} item={String(headItem + 1)} />;
              }
              return <TableHead key={headItem.dataIndex} item={headItem.title} />;
            })}
          </tr>
        </thead>
        <tbody>
          {normalizedDocuments?.map((tableRowItem: NormalisedTableRowItem) => {
            return <TableRow key={tableRowItem.id} data={tableRowItem} columns={allColumns} />;
          })}
        </tbody>
      </table>
    </div>
  );
};
