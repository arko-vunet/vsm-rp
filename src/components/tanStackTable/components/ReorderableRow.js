import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { css, cx } from "@emotion/css";
import { Tooltip, useStyles2, useTheme2 } from "@grafana/ui";
import { flexRender } from "@tanstack/react-table";
import { capitalize } from "lodash";
import { remToPx } from "../utils/remToPx";
import { VuIconButton } from "../../button/VuIconButton";
import { VuRow } from "../../grid/VuGrid";
import { getThresholdMixin } from "../utils/helper";
const ReorderableRow = ({ row, className }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const sortable = useSortable({ id: row.id });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
  return /* @__PURE__ */ jsx("tr", { ref: sortable.setNodeRef, className, children: row.getVisibleCells().map((cell, index) => {
    const cellValue = cell.getValue();
    const thresholdMixin = getThresholdMixin(cellValue, theme);
    const meta = cell.column.columnDef.meta;
    const resolvedTooltip = typeof meta?.tooltipContent === "function" ? meta.tooltipContent(cellValue, cell) : meta?.tooltipContent ?? capitalize(String(cellValue));
    const tdClass = cx(
      className,
      thresholdMixin,
      css({
        padding: theme.spacing(0.5, 1)
      })
    );
    return /* @__PURE__ */ jsx(
      "td",
      {
        className: tdClass,
        style: { ...style, width: cell.column.getSize() === 0 ? void 0 : cell.column.getSize() },
        children: index === 0 ? /* @__PURE__ */ jsxs(VuRow, { alignItems: "center", justify: "flex-end", className: css({ gap: 0 }), children: [
          /* @__PURE__ */ jsx(
            VuIconButton,
            {
              type: "button",
              name: "horizontal-grip",
              ...sortable.attributes,
              ...sortable.listeners,
              className: "dragButton",
              toolTip: "drag_and_drop"
            }
          ),
          flexRender(cell.column.columnDef.cell, cell.getContext())
        ] }) : /* @__PURE__ */ jsx("div", { className: styles.contentWrapper, children: cell.column.columnDef.meta?.withTooltip ? /* @__PURE__ */ jsx(Tooltip, { content: resolvedTooltip, children: /* @__PURE__ */ jsx("div", { className: styles.textWithTooltip(true), children: flexRender(cell.column.columnDef.cell, cell.getContext()) }) }) : /* @__PURE__ */ jsx("div", { className: styles.textWithTooltip(true), children: flexRender(cell.column.columnDef.cell, cell.getContext()) }) })
      },
      cell.id
    );
  }) });
};
const getStyles = (theme) => ({
  textWithTooltip: (isCompact) => {
    const fontSizePx = remToPx(theme.typography.body.fontSize, theme.typography.fontSize);
    const heightEightLines = 8 * fontSizePx * theme.typography.body.lineHeight;
    return css({
      overflow: "hidden",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      ...isCompact ? { WebkitLineClamp: 1, textOverflow: "ellipsis" } : { maxHeight: heightEightLines }
    });
  },
  contentWrapper: css({
    minHeight: theme.spacing(3),
    display: "flex",
    alignItems: "center"
  })
});
export {
  ReorderableRow
};
