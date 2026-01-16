import { css } from "@emotion/css";
function tableStyleMixin(theme) {
  return {
    highlightRow: css({
      background: theme.isDark ? "#f4f4f426" : "#3164ff26"
    }),
    showBorder: css({
      borderTop: "1px solid " + theme.colors.border.medium
    }),
    hasThresholdColor: (thresholdColor) => css({
      backgroundColor: thresholdColor,
      fontWeight: theme.typography.fontWeightBold
    })
  };
}
export {
  tableStyleMixin
};
