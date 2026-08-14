import styles from './TableStatistic.module.css';

type TableStatisticProps = {
  selectedIds: Set<string>;
};

export const TableStatistic = ({ selectedIds }: TableStatisticProps) => {
  return (
    <div className={styles['data-statistic']}>
      <ul>
        <li>Выбрано строк: </li>
        <li>Выбрано столбцов: </li>
        <li>Выбрано ячеек: {selectedIds.size}</li>
      </ul>
    </div>
  );
};
