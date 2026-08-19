import type { HandleScrollArgs, TableRowItem } from '../../types';
import { TableRow } from '../TableRow';

import styles from './TableBodyMiddle.module.css';

type TableBodyMiddleArgs = {
  bodyScrollRef: React.RefObject<HTMLDivElement | null>;
  headerScrollRef: React.RefObject<HTMLDivElement | null>;
  footerScrollRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: ({ sourceRef, firstTargetRef, secondTargetRef }: HandleScrollArgs<HTMLDivElement>) => void;
  tableData: TableRowItem[];
  isBigData?: boolean;
  dynamicColumns: number[];
  getCellBackground: ({ value }: { value: string }) => string;
  handleCellClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, cellId: string) => void;
  handleMouseMove: (currentId?: string | undefined) => void;
  handleMouseDown: (event: React.MouseEvent<Element, MouseEvent>, currentId?: string) => void;
};

export const TableBodyMiddle = ({
  bodyScrollRef,
  headerScrollRef,
  footerScrollRef,
  handleScroll,
  tableData,
  isBigData,
  dynamicColumns,
  getCellBackground,
  handleCellClick,
  handleMouseMove,
  handleMouseDown,
}: TableBodyMiddleArgs) => {
  return (
    <div
      ref={bodyScrollRef}
      onScroll={() =>
        handleScroll({
          sourceRef: bodyScrollRef,
          firstTargetRef: headerScrollRef,
          secondTargetRef: footerScrollRef,
        })
      }
      className={styles['body-middle']}
    >
      {tableData?.map((tableRowItem: TableRowItem) => {
        return (
          <TableRow
            isMid
            isBigData={isBigData}
            key={tableRowItem.id}
            data={tableRowItem}
            columns={dynamicColumns}
            getCellBackground={getCellBackground}
            handleCellClick={handleCellClick}
            handleMouseMove={handleMouseMove}
            handleMouseDown={handleMouseDown}
          />
        );
      })}
    </div>
  );
};
