import type { ColumnItem, TableRowItem } from '../types';

export const STATIC_LEFT_COLUMNS: ColumnItem<TableRowItem>[] = [
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

export const STATIC_RIGHT_COLUMNS: ColumnItem<TableRowItem>[] = [
  {
    title: 'All tags',
    dataIndex: 'allTags',
    id: 'allTags',
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    id: 'notes',
  },
];
