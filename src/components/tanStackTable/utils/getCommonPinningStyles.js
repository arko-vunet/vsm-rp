const getCommonPinningStyles = (column, theme, isCell) => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn = isPinned === "right" && column.getIsFirstColumn("right");
  return {
    boxShadow: isLastLeftPinnedColumn ? `-4px 0 4px -4px ${theme.colors.border.strong} inset` : isFirstRightPinnedColumn ? `4px 0 4px -4px ${theme.colors.border.strong} inset` : void 0,
    left: isPinned === "left" ? `${column.getStart("left")}px` : void 0,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : void 0,
    position: "sticky",
    width: column.getSize(),
    zIndex: isCell ? void 0 : 1,
    background: isCell ? theme.colors.background.canvas : "inherit",
    ...isCell ? {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%"
    } : {}
  };
};
export {
  getCommonPinningStyles
};
