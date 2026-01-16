import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { css, cx } from "@emotion/css";
import { useStyles2, useTheme2 } from "@grafana/ui";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { customColors } from "../resources";
import { VuIconButton } from "../../button/VuIconButton";
import { VuRow } from "../../grid/VuGrid";
import { actionColumnIDs } from "../constants";
import { getCommonPinningStyles } from "../utils/getCommonPinningStyles";
const DraggableTableHeader = ({
  header,
  config,
  table,
  isColumnDndEnable,
  onColumnResize,
  isHorizontalReorder = true
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id
  });
  const theme = useTheme2();
  const { t } = useTranslation();
  const styles = useStyles2(getStyles);
  const isPinned = header.column.getIsPinned();
  const isCheckboxColumn = header.column.id === "checkbox";
  const { hasColumnSorter } = config;
  const resizeHandler = header.getResizeHandler();
  const getResizeHandler = (event) => {
    onColumnResize && onColumnResize();
    resizeHandler(event);
  };
  return /* @__PURE__ */ jsx(
    "th",
    {
      className: styles.tableHeader(isDragging),
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
          justify: isCheckboxColumn && !isHorizontalReorder ? "flex-end" : "flex-start",
          alignItems: "center",
          className: "tableHeaderRow",
          children: [
            isColumnDndEnable && !actionColumnIDs.includes(header.column.id) && !isCheckboxColumn && /* @__PURE__ */ jsx(
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
            flexRender(header.column.columnDef.header, header.getContext()),
            hasColumnSorter && header.column.getCanSort() && /* @__PURE__ */ jsx(
              VuIconButton,
              {
                className: cx("icons", header.column.getIsSorted() ? "active" : ""),
                type: "button",
                onClick: header.column.getToggleSortingHandler(),
                name: {
                  asc: "list-down",
                  desc: "list-up"
                }[header.column.getIsSorted()] ?? "list",
                toolTip: header.column.getNextSortingOrder() === "asc" ? t("sort_entity", {
                  entity: t`ascending`
                }) : header.column.getNextSortingOrder() === "desc" ? t("sort_entity", {
                  entity: t`descending`
                }) : t`clear_sort`
              }
            ),
            header.column.getCanResize() && /* @__PURE__ */ jsx(
              "div",
              {
                onMouseDown: (e) => getResizeHandler(e),
                onTouchStart: (e) => getResizeHandler(e),
                className: cx(styles.resizeHandle, header.column.getIsResizing() ? styles.isResizing : ""),
                style: {
                  transform: header.column.getIsResizing() ? `translateX(${table.getState().columnSizingInfo.deltaOffset ?? 0}px)` : ""
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
  tableHeader: (isDragging) => css({
    padding: theme.spacing(0.5, 1),
    textAlign: "left",
    position: "relative",
    opacity: isDragging ? 0.8 : 1,
    whiteSpace: "nowrap",
    zIndex: isDragging ? 1 : 0,
    ".tableHeaderRow": {
      minHeight: 24
    },
    "&:hover .dragButton": {
      opacity: 1
    },
    ".dragButton": {
      cursor: isDragging ? "grabbing" : "grab",
      color: customColors.tableHeaderFont,
      opacity: 0.5,
      width: 10
    },
    ".icons": {
      opacity: 0.5,
      color: customColors.tableHeaderFont,
      "&.active": { opacity: 1 }
    }
  }),
  resizeHandle: css({
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "4px",
    background: customColors.tableHeaderFont,
    cursor: "col-resize",
    userSelect: "none",
    touchAction: "none",
    opacity: 0.5
  }),
  isResizing: css({
    opacity: 1
  })
});
export {
  DraggableTableHeader
};
