export const remToPx = (remValue, baseFontSize) => {
  const rem = Number.parseFloat(remValue);
  return rem * baseFontSize;
};
