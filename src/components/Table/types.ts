export type Tag = {
  id: number;
  text: string;
  color: string;
  order: number;
  allExcerpt: string;
};

export type TableRowItem = {
  id: number;
  name: string | null;
  groupName: string[] | string | null;
  groupNameStr: string | null;
  notes: string;
  number: string | null;
  type: string;
  showText: string;
  status: string;
  customName: string | null;
  projectDocumentId: number;
  allTags: number;
  tagsByOrder?: { [order: number]: Tag | undefined };
};

export type ExcerptsCount = {
  customName: string;
  excerptsCount: number;
  id: number;
};

type TagColor = {
  color: string;
};

export type TagsForHeader = {
  id: number;
  order: number;
  text: string;
  color: string;
  tagColor: TagColor;
};

export type TableData<T> = {
  documents: T[];
  excerptsCount: ExcerptsCount[];
  tagsForHeader: TagsForHeader[];
};

export type ColumnItem<T> = {
  title: string;
  dataIndex?: keyof T;
  id: string;
};

export type TableColumn<T> = ColumnItem<T> | number;

export type TableProps<T> = {
  data: TableData<T>;
  leftColumns: ColumnItem<T>[];
  rightColumns: ColumnItem<T>[];
};

export type NormalizeDocuments = (TableRowItem & {
  tagsByOrder: Tag[];
})[];
