import styles from './TableStatistic.module.css';

type TableStatisticProps = {
  numberOfCells: number;
  numberOfRows?: number;
  numberOfColumns?: number;
};

export const TableStatistic = ({ numberOfCells }: TableStatisticProps) => {
  return (
    <div className={styles['data-statistic']}>
      <ul>
        {/* <li>Выбрано строк: {numberOfRows}</li> */}
        {/* <li>Выбрано столбцов: {numberOfColumns}</li> */}
        <li>Выбрано ячеек: {numberOfCells}</li>
      </ul>
    </div>
  );
};
