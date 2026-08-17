import type { ColumnItem } from '../types';

export const STATIC_LEFT_COLUMNS: ColumnItem[] = [
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

export const getStaticRightColumns: (isBigData: boolean) => ColumnItem[] = <T>(isBigData: boolean) => {
  const commonColumns = [
    {
      title: 'Groups',
      dataIndex: 'groupNameStr',
      id: 'groupNameStr',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      id: 'notes',
    },
  ];
  return isBigData
    ? [
        {
          title: 'All claims',
          dataIndex: 'allClaims',
          id: 'allClaims' as keyof T,
        },
        ...commonColumns,
      ]
    : [
        {
          title: 'All tags',
          dataIndex: 'allTags',
          id: 'allTags',
        },
        ...commonColumns,
      ];
};
