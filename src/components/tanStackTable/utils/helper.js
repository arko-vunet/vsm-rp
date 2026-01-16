import { tableStyleMixin } from "../mixins";
const getThresholdMixin = (cellValue, theme) => {
  const mixins = tableStyleMixin(theme);
  const thresholdColor = cellValue && typeof cellValue === "object" && "thresholdColor" in cellValue && "applyColorOn" in cellValue && cellValue.applyColorOn === 'background' ? cellValue.thresholdColor : void 0;
  return typeof mixins.hasThresholdColor === "function" && thresholdColor ? mixins.hasThresholdColor(thresholdColor) : void 0;
};
export {
  getThresholdMixin
};
