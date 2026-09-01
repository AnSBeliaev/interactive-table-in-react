import { useSelectionSelector } from '../../../../constext/selection/useSelectionSelector';
import { useGetStatistic, useGetSumOfCells } from '../../hooks';
import type { NormalizedDocuments, TableRowItem } from '../../types';
import styles from './TableStatistic.module.css';

type TableStatisticProps = {
  normalizedDocuments: NormalizedDocuments;
  isBigData?: boolean;
  documents: TableRowItem[];
  columnOrders: number[];
};

export const TableStatistic = ({
  normalizedDocuments,
  isBigData,
  documents,
  columnOrders,
}: TableStatisticProps) => {
  const selectedIds = useSelectionSelector((state) => state.selectedIds);
  const isSelectAll = selectedIds.has('allClaims-footer') || selectedIds.has('allTags-footer');
  const { selectedCells, selectedRows, selectedColumns } = useGetStatistic({
    selectedIds,
    isSelectAll,
    totalRows: documents.length,
    totalColumns: columnOrders.length,
  });

  const sumOfCells = useGetSumOfCells({
    normalizedDocuments,
    selectedIds,
    isBigData,
    documents,
    columnOrders,
  });
  return (
    <div className={styles['data-statistic']}>
      <ul>
        <li>Выбрано строк: {selectedRows.size}</li>
        <li>Выбрано столбцов: {selectedColumns.size}</li>
        <li>Выбрано ячеек: {selectedCells.size}</li>
        <li>Сумма значений ячеек: {sumOfCells}</li>
      </ul>
    </div>
  );
};
