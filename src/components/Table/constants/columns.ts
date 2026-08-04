import type { ColumnItem } from '../types';

export const STATIC_LEFT_COLUMNS: ColumnItem[] = [
  {
    title: 'View',
    dataIndex: 'view',
  },
  {
    title: 'Document',
    dataIndex: 'name',
  },
];

export const STATIC_RIGHT_COLUMNS: ColumnItem[] = [
  {
    title: 'All tags',
    dataIndex: 'allTags',
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
  },
];
