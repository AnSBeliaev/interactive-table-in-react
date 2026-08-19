import { useSelection } from '../../../../constext';
import { EMPTY_SELECTED_CELL_IDS } from '../../constants';
import { useGetSelectedIdsByRow } from '../../hooks';
import type { ColumnItem, TableRowItem } from '../../types';
import { TableRow } from '../TableRow';
import styles from './TableBodyLeft.module.css';

type TableBodyLeftArgs = {
  tableData: TableRowItem[];
  leftColumns: ColumnItem[];
};

export const TableBodyLeft = ({ tableData, leftColumns }: TableBodyLeftArgs) => {
  const { selectedIds } = useSelection();
  const selectedSideIdsByRow = useGetSelectedIdsByRow(selectedIds, false);
  return (
    <div className={styles['table-body-left']}>
      {tableData?.map((tableRowItem: TableRowItem) => {
        return (
          <TableRow
            key={tableRowItem.id}
            data={tableRowItem}
            columns={leftColumns}
            selectedCellIds={selectedSideIdsByRow.get(tableRowItem.id) ?? EMPTY_SELECTED_CELL_IDS}
          />
        );
      })}
    </div>
  );
};
