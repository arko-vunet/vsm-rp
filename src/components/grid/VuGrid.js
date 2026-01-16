import { jsx } from "@emotion/react/jsx-runtime";
import { css, cx } from "@emotion/css";
import { useStyles2 } from "@grafana/ui";
import { forwardRef } from "react";
const defaultProps = {
  direction: "row",
  wrap: true,
  align: "flex-start",
  alignItems: "stretch",
  justify: "flex-start",
  gap: 0,
  grow: true,
  shrink: false
};
const VuGrid = forwardRef(
  ({ children, columns, direction, wrap, align, alignItems, justify, gap, grow, shrink, className, ...htmlDivProps }, ref) => {
    const props = {
      columns: columns ?? defaultProps.columns,
      direction: direction ?? defaultProps.direction,
      wrap: wrap ?? defaultProps.wrap,
      align: align ?? defaultProps.align,
      alignItems: alignItems ?? defaultProps.alignItems,
      justify: justify ?? defaultProps.justify,
      gap: gap ?? defaultProps.gap,
      grow: grow ?? defaultProps.grow,
      shrink: shrink ?? defaultProps.shrink,
      className
    };
    const styles = useStyles2(getStyles);
    return /* @__PURE__ */ jsx("div", { ref, className: cx(styles.grid(props), className), ...htmlDivProps, children });
  }
);
VuGrid.displayName = "VuGrid";
const getStyles = (theme) => ({
  grid: ({ align, alignItems, columns, direction, gap, wrap, grow, shrink, justify }) => {
    const finalGap = typeof gap === "string" ? gap : theme.spacing(gap);
    return css({
      boxSizing: "border-box",
      display: "flex",
      columnCount: columns,
      gap: finalGap,
      alignContent: align,
      alignItems,
      flexDirection: direction,
      flexWrap: wrap ? "wrap" : "initial",
      justifyContent: justify,
      ">*": {
        flexGrow: grow ? 1 : 0,
        flexShrink: shrink ? 1 : 0,
        // flexBasis: 100 / (columns ?? 1) + '%',
        flexBasis: columns ? `calc(${100 / columns}% - ${finalGap} + ${finalGap}/${columns})` : void 0
      }
    });
  }
});
const VuRow = forwardRef((props, ref) => /* @__PURE__ */ jsx(
  VuGrid,
  {
    ref,
    ...props,
    gap: 1,
    grow: false,
    shrink: props.shrink ?? true,
    wrap: props.wrap ?? false,
    direction: "row"
  }
));
VuRow.displayName = "VuRow";
const VuColumn = forwardRef(
  (props, ref) => /* @__PURE__ */ jsx(
    VuGrid,
    {
      ref,
      ...props,
      gap: 1,
      grow: false,
      shrink: props.shrink ?? true,
      wrap: props.wrap ?? true,
      direction: "column",
      align: props.align ?? "stretch"
    }
  )
);
VuColumn.displayName = "VuColumn";
export {
  VuColumn,
  VuGrid,
  VuRow
};
