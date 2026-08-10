import type { SelectionAction } from '../../../../constext/selection/SelectionContext';

type GetCellIdsInRangeArgs = {
  anchorId: string;
  currentId: string;
  rowIds?: number[];
  columnIds: number[];
  dispatch: React.Dispatch<SelectionAction>;
};

export const getCellIdsInRange = ({ anchorId, currentId, rowIds, columnIds, dispatch }: GetCellIdsInRangeArgs) => {
  if (!rowIds) return;
  const anchorSep = anchorId.lastIndexOf('-');
  const currentSep = currentId.lastIndexOf('-');
  const anchorColumnId = anchorId.slice(0, anchorSep);
  const anchorRowId = anchorId.slice(anchorSep + 1);
  const currentColumnId = currentId.slice(0, currentSep);
  const currentRowId = currentId.slice(currentSep + 1);
  const selectedIdsSet = new Set<string>();

  const r1 = rowIds.indexOf(Number(anchorRowId));
  const r2 = rowIds.indexOf(Number(currentRowId));
  const c1 = columnIds.indexOf(Number(anchorColumnId));
  const c2 = columnIds.indexOf(Number(currentColumnId));
  for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
    for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
      selectedIdsSet.add(`${columnIds[c]}-${rowIds[r]}`);
    }
  }
  dispatch({
    type: 'set',
    ids: selectedIdsSet,
  });
};

export const throttle = <T extends unknown[]>(func: (...args: T) => void, delay: number) => {
  let lastCall = 0;

  return (...args: T) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};
