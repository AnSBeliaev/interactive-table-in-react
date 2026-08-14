import type { SelectionAction } from '../../constext/selection/SelectionContext';

type GetPercentageArgs = {
  min: number;
  max: number;
  currentValue: number;
};

const STEP = 5;
const MIN_PERCENT = 5;
const MAX_PERCENT = 100;

type Rgb = { r: number; g: number; b: number };

export const getPercentage = ({ min, max, currentValue }: GetPercentageArgs) => {
  if (currentValue < min) return null;
  if (currentValue > max) return 100;
  const progress = (currentValue - min) / (max - min);

  const percent = MIN_PERCENT + progress * (MAX_PERCENT - MIN_PERCENT);
  const percentage = Math.round(percent / STEP) * STEP;

  if (percentage === MAX_PERCENT) return 100;
  return percentage;
};

const parseHexColor = (hex: string): Rgb | null => {
  const normalized = hex.trim().replace('#', '');
  if (normalized.length !== 6) return null;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if (![r, g, b].every(Number.isFinite)) return null;
  return { r, g, b };
};

const lerpChannel = (from: number, to: number, t: number) => Math.round(from + (to - from) * t);

const mixRgb = (from: Rgb, to: Rgb, t: number): Rgb => ({
  r: lerpChannel(from.r, to.r, t),
  g: lerpChannel(from.g, to.g, t),
  b: lerpChannel(from.b, to.b, t),
});

const rgbToCss = ({ r, g, b }: Rgb) => `rgb(${r}, ${g}, ${b})`;

const getHeatColors = () => {
  const styles = getComputedStyle(document.documentElement);
  const minHex = styles.getPropertyValue('--tag-heat-min-color').trim() || '#f3f9fd';
  const maxHex = styles.getPropertyValue('--full-tag-bg-color').trim() || '#66b8ee';

  return {
    min: parseHexColor(minHex) ?? { r: 243, g: 249, b: 253 },
    max: parseHexColor(maxHex) ?? { r: 102, g: 184, b: 238 },
  };
};

type CreateGetCellBackgroundArgs = {
  min: number | null;
  max: number | null;
  isDark?: boolean;
};

export const createGetCellBackground = ({ min, max }: CreateGetCellBackgroundArgs) => {
  const getCellBackground = ({ value }: { value: string }) => {
    const currentValue = Number(value);
    const minValue = Number(min);
    const maxValue = Number(max);
    const canColor =
      currentValue > 0 &&
      value !== '' &&
      value != null &&
      Number.isFinite(currentValue) &&
      Number.isFinite(minValue) &&
      Number.isFinite(maxValue) &&
      maxValue > minValue;

    if (!canColor) return '';

    const percent = getPercentage({
      min: minValue,
      max: maxValue,
      currentValue,
    });

    if (percent == null) return '';

    const { min: minColor, max: maxColor } = getHeatColors();
    const mixed = mixRgb(minColor, maxColor, percent / 100);
    return rgbToCss(mixed);
  };

  return getCellBackground;
};

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

export const getRowSelectedIds = (rowId: string | number) => [
  `view-${rowId}`,
  `name-${rowId}`,
  `allTags-${rowId}`,
  `groupNameStr-${rowId}`,
  `notes-${rowId}`,
];

const getColumnSelectedIds = (columnOrder: string | number) => [`${columnOrder}-footer`];

export const syncSelectedRow = (ids: Set<string>, rowId: string | number, tagColumnIds: number[]) => {
  const rowTagIds = tagColumnIds.map((order) => `${order}-${rowId}`);
  const selected = getRowSelectedIds(rowId);
  const allTagsSelected = rowTagIds.every((id) => ids.has(id));

  if (allTagsSelected) {
    selected.forEach((id) => ids.add(id));
  } else {
    selected.forEach((id) => ids.delete(id));
  }
};

export const syncSelectedColumn = (ids: Set<string>, columnId: string | number, rowIds: number[]) => {
  const rowTagIds = rowIds.map((rowId) => `${columnId}-${rowId}`);
  const selected = getColumnSelectedIds(columnId);
  const allTagsSelected = rowTagIds.every((id) => ids.has(id));

  if (allTagsSelected) {
    selected.forEach((id) => ids.add(id));
  } else {
    selected.forEach((id) => ids.delete(id));
  }
};

export const syncSelectedRows = (ids: Set<string>, rowIds: number[], tagColumnIds: number[]) => {
  for (const rowId of rowIds) {
    syncSelectedRow(ids, rowId, tagColumnIds);
  }
};

export const syncSelectedColumns = (ids: Set<string>, rowIds: number[], tagColumnIds: number[]) => {
  for (const columnId of tagColumnIds) {
    syncSelectedColumn(ids, columnId, rowIds);
  }
};

export const getNextAnchorId = (
  remainingIds: Set<string>,
  rowIds: number[] = [],
  columnIds: Array<string | number> = [],
): string => {
  if (remainingIds.size === 0) return '';

  let best: { rowIndex: number; columnIndex: number; id: string } | null = null;

  for (const id of remainingIds) {
    const sep = id.lastIndexOf('-');
    if (sep === -1) continue;

    const columnKey = id.slice(0, sep);
    const rowId = Number(id.slice(sep + 1));
    if (!Number.isFinite(rowId)) continue;

    const rowIndex = rowIds.indexOf(rowId);
    const columnIndex = columnIds.findIndex((column) => String(column) === columnKey);
    if (rowIndex === -1 || columnIndex === -1) continue;

    if (!best || rowIndex < best.rowIndex || (rowIndex === best.rowIndex && columnIndex < best.columnIndex)) {
      best = { rowIndex, columnIndex, id };
    }
  }

  return best?.id ?? remainingIds.values().next().value ?? '';
};

export const getScrollbarWidth = (): number => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);
  return scrollbarWidth;
};

export const getRowAndColumnIds = (id: string) => {
  const sep = id.lastIndexOf('-');
  if (sep === -1) return { columnId: null, rowId: null };

  const columnId = id.slice(0, sep);
  const rowId = Number(id.slice(sep + 1));
  return { columnId, rowId };
};
