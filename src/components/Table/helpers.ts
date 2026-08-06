type GetPercentageArgs = {
  min: number;
  max: number;
  currentValue: number;
};

const STEP = 5;
const MIN_PERCENT = 5;
const MAX_PERCENT = 100;

export const getPercentage = ({ min, max, currentValue }: GetPercentageArgs) => {
  if (currentValue < min) return null;
  if (currentValue > max) return 100;
  const progress = (currentValue - min) / (max - min);

  const percent = MIN_PERCENT + progress * (MAX_PERCENT - MIN_PERCENT);
  const percentage = Math.round(percent / STEP) * STEP;

  if (percentage === MAX_PERCENT) return 100;
  return percentage;
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

    const percent = getPercentage({
      min: minValue,
      max: maxValue,
      currentValue,
    });

    return `rgba(102, 184, 238, ${percent != null && canColor ? percent / 100 : ''})`;
  };

  return getCellBackground;
};
