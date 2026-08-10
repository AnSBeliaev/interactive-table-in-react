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
  console.log('styles: >>>', styles);
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
