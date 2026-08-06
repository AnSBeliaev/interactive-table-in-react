type GetPercentageArgs = {
  min: number;
  max: number;
  current: number;
};

const STEP = 5;
const MIN_PERCENT = 5;
const MAX_PERCENT = 100;

export const getPercentage = ({ min, max, current }: GetPercentageArgs) => {
  if (current < min) return null;
  if (current > max) return null;
  const progress = (current - min) / (max - min);

  const percent = MIN_PERCENT + progress * (MAX_PERCENT - MIN_PERCENT);
  const percentage = Math.round(percent / STEP) * MIN_PERCENT;

  if (percentage === MAX_PERCENT) return 100;
  return percentage;
};
