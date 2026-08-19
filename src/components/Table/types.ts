export type Tag = {
  id: number;
  text: string;
  color: string;
  order: number;
  allExcerpt: string;
};

export type Claim = {
  id: number;
  order: number;
  allExcerpts: number;
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
  allTags?: number;
  allClaims?: number;
  tagsByOrder?: Map<number, Tag>;

  claims?: Claim[];
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
  excerptsCount?: ExcerptsCount[];
  tagsForHeader?: TagsForHeader[];
};

export type ColumnItem = {
  title: string;
  dataIndex?: string;
  id: string | number;
};

export type TableColumn = ColumnItem | number;

export type TableProps<T> = {
  data: TableData<T>;
  leftColumns: ColumnItem[];
  rightColumns: ColumnItem[];
  isBigData?: boolean;
};

export type NormalizedDocuments = (TableRowItem & {
  tagsByOrder: Map<number, Tag>;
})[];

export type HandleScrollArgs<T> = {
  sourceRef: React.RefObject<T | null>;
  firstTargetRef: React.RefObject<T | null>;
  secondTargetRef: React.RefObject<T | null>;
};
