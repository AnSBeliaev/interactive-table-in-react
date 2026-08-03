type TableHead = {
  item: string;
};

export const TableHead = ({ item }: TableHead) => {
  return <td title={item}>{item}</td>;
};
