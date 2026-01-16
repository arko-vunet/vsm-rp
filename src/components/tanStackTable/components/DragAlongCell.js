import { jsx } from "@emotion/react/jsx-runtime";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { css, cx } from "@emotion/css";
import { Tooltip, useStyles2, useTheme2 } from "@grafana/ui";
import { flexRender } from "@tanstack/react-table";
import { remToPx } from "../utils/remToPx";
import { applyHighlight } from "../utils/applyHighlight";
import { getCommonPinningStyles } from "../utils/getCommonPinningStyles";
const DragAlongCell = ({
  cell,
  isCompact,
  config,
  thresholdClass,
  variant
}) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id
  });
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const { withTooltip, tooltipContent, highlightText, justify } = cell.column.columnDef.meta || {};
  const isPinned = cell.column.getIsPinned();
  const cellValue = cell.getValue();
  const { hasHighlightText } = config;
  const shouldHighlight = hasHighlightText && typeof cellValue === "string" && highlightText && highlightText.length > 0;
  const content = shouldHighlight ? applyHighlight(cellValue, highlightText) : flexRender(cell.column.columnDef.cell, cell.getContext());
  const rawValue = cell.getValue();
  const resolvedTooltip = typeof tooltipContent === "function" ? tooltipContent(rawValue, cell) : tooltipContent ?? String(rawValue ?? "");
  return /* @__PURE__ */ jsx(
    "td",
    {
      className: styles.tableData(isDragging, transform, variant),
      style: {
        ...isPinned ? getCommonPinningStyles(cell.column, theme, true) : {},
        width: cell.column.getSize() === 0 ? void 0 : cell.column.getSize()
      },
      ref: setNodeRef,
      children: /* @__PURE__ */ jsx("div", { className: cx(styles.contentContainer, thresholdClass), children: /* @__PURE__ */ jsx("div", { className: styles.contentWrapper(justify), children: withTooltip ? /* @__PURE__ */ jsx(Tooltip, { content: resolvedTooltip, children: /* @__PURE__ */ jsx("div", { className: styles.textWithTooltip(isCompact), children: content }) }) : /* @__PURE__ */ jsx("div", { className: styles.textWithTooltip(isCompact), children: content }) }) })
    },
    cell.id
  );
};
const getStyles = (theme) => ({
  tableData: (isDragging, transform, variant) => css({
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    zIndex: isDragging ? 1 : 0,
    padding: theme.spacing(0.25),
    borderTop: "1px solid " + (variant === "default" ? theme.colors.border.medium : theme.colors.border.weak),
    textAlign: "left"
  }),
  textWithTooltip: (isCompact) => {
    const fontSizePx = remToPx(theme.typography.body.fontSize, theme.typography.fontSize);
    const heightEightLines = 8 * fontSizePx * theme.typography.body.lineHeight;
    return css({
      overflow: "hidden",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      ...isCompact ? { WebkitLineClamp: 1, textOverflow: "ellipsis" } : {
        maxHeight: heightEightLines
      }
    });
  },
  contentContainer: css({
    padding: theme.spacing(0.25, 0.75),
    borderRadius: "4px"
  }),
  contentWrapper: (justify) => css({
    minHeight: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    justifyContent: justify ?? "flex-start"
  })
});
export {
  DragAlongCell
};
