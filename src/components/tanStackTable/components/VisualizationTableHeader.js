import { Fragment, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { css, cx } from "@emotion/css";
import { useStyles2, useTheme2 } from "@grafana/ui";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { VuIconButton } from "../../button/VuIconButton";
import { VuRow } from "../../grid/VuGrid";
import { actionColumnIDs } from "../constants";
import { getCommonPinningStyles } from "../utils/getCommonPinningStyles";
import { getHeaderTooltip } from "../utils/getHeaderTooltip";
const VisualizationTableHeader = ({
  header,
  config,
  table,
  isColumnDndEnable,
  onColumnResize,
  isHorizontalReorder = true
}) => {
  const {
    id,
    columnDef,
    getIsPinned,
    getCanResize,
    getIsSorted,
    getNextSortingOrder,
    getCanSort,
    getToggleSortingHandler,
    getIsResizing
  } = header.column;
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id
  });
  const theme = useTheme2();
  const { t } = useTranslation();
  const styles = useStyles2(getStyles);
  const isPinned = getIsPinned();
  const isCheckboxColumn = id === "checkbox";
  const { hasColumnSorter } = config;
  const { justify } = columnDef.meta || {};
  const resizeHandler = header.getResizeHandler();
  const canResize = getCanResize();
  const getResizeHandler = (event) => {
    onColumnResize?.();
    resizeHandler(event);
  };
  const canSort = getCanSort();
  const isSorted = getIsSorted();
  const nextSortingOrder = getNextSortingOrder();
  return /* @__PURE__ */ jsx(
    "th",
    {
      className: styles.tableHeader(isDragging, canResize),
      colSpan: header.colSpan,
      ref: setNodeRef,
      style: {
        ...isPinned ? getCommonPinningStyles(header.column, theme) : {},
        transform: CSS.Translate.toString(transform),
        width: header.getSize() === 0 ? void 0 : header.getSize()
      },
      children: !header.isPlaceholder && /* @__PURE__ */ jsxs(
        VuRow,
        {
          justify: justify ?? (isCheckboxColumn && !isHorizontalReorder ? "flex-end" : "flex-start"),
          alignItems: "center",
          className: "tableHeaderRow",
          children: [
            isColumnDndEnable && !actionColumnIDs.includes(id) && !isCheckboxColumn && /* @__PURE__ */ jsx(
              VuIconButton,
              {
                type: "button",
                name: "dragdrop",
                ...attributes,
                ...listeners,
                className: "dragButton",
                toolTip: t`drag_and_drop`
              }
            ),
            (() => {
              const sortIcon = hasColumnSorter && canSort ? /* @__PURE__ */ jsx(
                VuIconButton,
                {
                  className: cx("icons", isSorted ? "active" : ""),
                  type: "button",
                  onClick: getToggleSortingHandler(),
                  name: {
                    asc: "arrow-narrow-up",
                    desc: "arrow-narrow-down"
                  }[isSorted] ?? "switch-vertical",
                  toolTip: getHeaderTooltip(canSort, isSorted, nextSortingOrder, t)
                }
              ) : null;
              if (justify === "flex-end") {
                return /* @__PURE__ */ jsxs(Fragment, { children: [
                  sortIcon,
                  /* @__PURE__ */ jsx("div", { className: styles.textWithTooltip, children: flexRender(columnDef.header, header.getContext()) })
                ] });
              }
              return /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: styles.textWithTooltip, children: flexRender(columnDef.header, header.getContext()) }),
                sortIcon
              ] });
            })(),
            canResize && /* @__PURE__ */ jsx(
              "div",
              {
                onMouseDown: (e) => getResizeHandler(e),
                onTouchStart: (e) => getResizeHandler(e),
                className: cx("resizeHandle", getIsResizing() ? "isResizing" : ""),
                style: {
                  transform: getIsResizing() ? `translateX(${table.getState().columnSizingInfo.deltaOffset ?? 0}px)` : ""
                }
              }
            )
          ]
        }
      )
    }
  );
};
const getStyles = (theme) => ({
  tableHeader: (isDragging, canResize) => css({
    padding: theme.spacing(0.5, 1),
    textAlign: "left",
    fontWeight: theme.typography.fontWeightMedium,
    position: "relative",
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    "&:hover": {
      ...canResize && { borderRight: `1px solid ${theme.colors.border.medium}` }
    },
    ".tableHeaderRow": {
      minHeight: 24
    },
    ".dragButton, .icons": {
      display: "none"
    },
    "&:hover .dragButton, &:hover .icons": {
      display: "inline-flex"
    },
    ".dragButton": {
      cursor: isDragging ? "grabbing" : "grab",
      color: theme.colors.text.primary,
      width: 10,
      alignItems: "center",
      justifyContent: "center"
    },
    ".icons": {
      color: theme.colors.text.primary,
      alignItems: "center",
      justifyContent: "center",
      "&.active": { display: "inline-flex" }
    },
    ".resizeHandle": {
      position: "absolute",
      right: 0,
      top: 0,
      height: "100%",
      width: "4px",
      // visually invisible but hoverable:
      background: "transparent",
      cursor: "col-resize",
      userSelect: "none",
      touchAction: "none",
      display: "block",
      // must exist to be hoverable
      opacity: 0,
      // invisible initially
      transition: theme.transitions.create(["opacity", "background"], {
        duration: 120,
        easing: theme.transitions.easing.easeIn
      })
    },
    // visible when hovering the handle itself, or when resizing
    ".resizeHandle:hover, .resizeHandle.isResizing": {
      background: theme.colors.text.primary,
      opacity: 0.45
    },
    ".resizeHandle.isResizing": {
      opacity: 1,
      background: theme.colors.text.primary
    }
  }),
  textWithTooltip: css({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  })
});
export {
  VisualizationTableHeader
};
