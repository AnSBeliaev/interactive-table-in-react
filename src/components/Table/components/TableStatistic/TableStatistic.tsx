import styles from './TableStatistic.module.css';

type TableStatisticProps = {
  numberOfCells: number;
  numberOfRows?: number;
  numberOfColumns?: number;
  sumOfCells?: number;
};

export const TableStatistic = ({ numberOfCells, numberOfRows, numberOfColumns, sumOfCells }: TableStatisticProps) => {
  return (
    <div className={styles['data-statistic']}>
      <ul>
        <li>Выбрано строк: {numberOfRows}</li>
        <li>Выбрано столбцов: {numberOfColumns}</li>
        <li>Выбрано ячеек: {numberOfCells}</li>
        <li>Сумма значений ячеек: {sumOfCells}</li>
      </ul>
    </div>
  );
};
