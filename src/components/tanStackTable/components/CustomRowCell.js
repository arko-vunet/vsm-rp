import { jsx } from "@emotion/react/jsx-runtime";
import { css } from "@emotion/css";
import { Tooltip, useStyles2 } from "@grafana/ui";
function CustomRowCell({ header, children }) {
  const styles = useStyles2(getStyles);
  const { justify } = header.column.columnDef.meta || {};
  return /* @__PURE__ */ jsx(
    "td",
    {
      className: styles.tableData,
      style: {
        width: header.column.getSize() === 0 ? void 0 : header.column.getSize()
      },
      children: /* @__PURE__ */ jsx("div", { className: styles.contentWrapper(justify), children: /* @__PURE__ */ jsx(Tooltip, { content: children ?? "", children: /* @__PURE__ */ jsx("div", { className: styles.textWithTooltip, children }) }) })
    }
  );
}
const getStyles = (theme) => ({
  tableData: css({
    padding: theme.spacing(0.5, 1),
    borderTop: "1px solid " + theme.colors.border.weak,
    backgroundColor: theme.colors.background.secondary,
    position: "sticky",
    bottom: 0
  }),
  contentWrapper: (justify) => css({
    minHeight: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    justifyContent: justify ?? "flex-start"
  }),
  textWithTooltip: css({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  })
});
export {
  CustomRowCell
};
