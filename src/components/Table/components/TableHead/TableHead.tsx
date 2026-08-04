type TableHeadProps = {
  item: string;
};

export const TableHead = (props: TableHeadProps) => {
  return <td title={props.item}>{props.item}</td>;
};
