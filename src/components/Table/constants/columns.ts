import type { ColumnItem, TableRowItem } from '../types';

export const STATIC_COLUMNS: ColumnItem<TableRowItem>[] = [
  {
    title: 'view',
    id: 'view',
  },
  {
    title: 'Document',
    dataIndex: 'name',
    id: 'name',
  },
];
