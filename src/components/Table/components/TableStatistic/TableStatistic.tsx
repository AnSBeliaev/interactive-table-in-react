import { useSelectionSelector } from '../../../../constext/selection/useSelectionSelector';
import { useGetStatistic, useGetSumOfCells } from '../../hooks';
import type { NormalizedDocuments, TableRowItem } from '../../types';
import styles from './TableStatistic.module.css';

type TableStatisticProps = {
  normalizedDocuments: NormalizedDocuments;
  isBigData?: boolean;
  documents: TableRowItem[];
};

export const TableStatistic = ({ normalizedDocuments, isBigData, documents }: TableStatisticProps) => {
  const selectedIds = useSelectionSelector((state) => state.statsSelectedIds);
  const { selectedCells, selectedRows, selectedColumns } = useGetStatistic(selectedIds);

  const sumOfCells = useGetSumOfCells({ normalizedDocuments, selectedIds, isBigData, documents });
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
