import { memo } from 'react';
import type { ColumnItem, TableRowItem } from '../../types';
import { TableRow } from '../TableRow';

import styles from './TableBodyRight.module.css';

type TableBodyRightArgs = {
  tableData: TableRowItem[];
  handleAllTagsCellClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => void;
  rightColumns: ColumnItem[];
  handleMouseMove: (currentId?: string | undefined) => void;
  getCellBackground: ({ value }: { value: string }) => string;
};

export const TableBodyRight = memo(
  ({ tableData, handleAllTagsCellClick, rightColumns, handleMouseMove, getCellBackground }: TableBodyRightArgs) => {
    return (
      <div className={styles['table-body-right']}>
        {tableData?.map((tableRowItem: TableRowItem) => {
          return (
            <TableRow
              handleCellClick={handleAllTagsCellClick}
              key={tableRowItem.id}
              data={tableRowItem}
              columns={rightColumns}
              handleMouseMove={handleMouseMove}
              getCellBackground={getCellBackground}
            />
          );
        })}
      </div>
    );
  },
);
