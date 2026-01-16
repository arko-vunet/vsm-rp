import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { restrictToHorizontalAxis, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { css, cx } from "@emotion/css";
import { useStyles2, useTheme2 } from "@grafana/ui";
import { useRef, useState } from "react";
import { customColors } from "./resources";
import { ActionsRow } from "./components/ActionsRow";
import { CustomRowCell } from "./components/CustomRowCell";
import { DragAlongCell } from "./components/DragAlongCell";
import { DraggableTableHeader } from "./components/DraggableTableHeader";
import { FooterRow } from "./components/FooterRow";
import { ReorderableRow } from "./components/ReorderableRow";
import { VisualizationTableHeader } from "./components/VisualizationTableHeader";
import { useAutoColumnSizing } from "./hooks/useAutoColumnSizing";
import { tableStyleMixin } from "./mixins";
import { getThresholdMixin } from "./utils/helper";
const defaultTableConfig = {
  hasColumnSorter: true,
  hasPagination: true,
  hasHeader: true,
  hasRowsPerPageOption: true,
  hasHighlightText: true,
  isSkipAutoSizing: false,
  hasActionsRow: true
};
const VuTanStackTable = ({
  table,
  columnOrder,
  handleDragEnd,
  config,
  groupActions,
  customControls,
  rowClassName,
  isTableResized = false,
  onColumnResize,
  forceRenderCount = 0,
  reorderType = "horizontal",
  rowOrder,
  variant = "default",
  customRowData,
  className
}) => {
  const tableContainerRef = useRef(null);
  const {
    getFlatHeaders,
    getCenterTotalSize,
    setColumnSizing,
    options: { enableColumnResizing }
  } = table;
  const headers = getFlatHeaders();
  const isResizingEnable = enableColumnResizing ?? false;
  useAutoColumnSizing({
    headers,
    setColumnSizing,
    tableContainerRef,
    isTableResized,
    forceRenderCount,
    isResizingEnable,
    isSkipAutoSizing: config?.isSkipAutoSizing
  });
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));
  const [isCompact, setCompact] = useState(false);
  const theme = useTheme2();
  const { getHeaderGroups, getRowModel, getSelectedRowModel, getPageCount } = table;
  const numberOfPages = getPageCount();
  const isColumnDndEnable = !!handleDragEnd && reorderType !== "vertical";
  const onDragEnd = (event) => {
    if (!handleDragEnd) {
      return;
    }
    const { active, over } = event;
    if (over?.id === "checkbox" || !active || !over || active.id === over.id) {
      return;
    }
    if (reorderType === "horizontal") {
      const oldIndex = columnOrder.indexOf(active.id);
      const newIndex = columnOrder.indexOf(over.id);
      handleDragEnd(arrayMove(columnOrder, oldIndex, newIndex));
    }
    if (reorderType === "vertical" && rowOrder) {
      const oldIndex = rowOrder.indexOf(active.id);
      const newIndex = rowOrder.indexOf(over.id);
      handleDragEnd(arrayMove(rowOrder, oldIndex, newIndex));
    }
  };
  const tableConfig = { ...defaultTableConfig, ...config };
  const { hasPagination, hasHeader, hasActionsRow } = tableConfig;
  const styles = useStyles2(getStyles, variant);
  return /* @__PURE__ */ jsxs("div", { className: cx(styles.tableWrapper, className), ref: tableContainerRef, children: [
    hasActionsRow && /* @__PURE__ */ jsx(
      ActionsRow,
      {
        config: tableConfig,
        selectedRows: getSelectedRowModel().rows,
        groupActions,
        customControls,
        isCompact,
        setCompact
      }
    ),
    numberOfPages > 0 && /* @__PURE__ */ jsx(
      DndContext,
      {
        collisionDetection: closestCenter,
        modifiers: [reorderType === "horizontal" ? restrictToHorizontalAxis : restrictToVerticalAxis],
        onDragEnd,
        sensors,
        children: /* @__PURE__ */ jsx("div", { className: styles.tableContainer, children: /* @__PURE__ */ jsxs(
          "table",
          {
            style: {
              width: isResizingEnable ? getCenterTotalSize() : "100%",
              tableLayout: isResizingEnable ? "fixed" : "auto"
            },
            children: [
              /* @__PURE__ */ jsx("thead", { className: hasHeader ? "" : styles.hideElement, children: getHeaderGroups().map(
                (headerGroup) => reorderType === "vertical" ? /* @__PURE__ */ jsx("tr", { children: headerGroup.headers.map((header) => /* @__PURE__ */ jsx(
                  DraggableTableHeader,
                  {
                    header,
                    config: tableConfig,
                    table,
                    onColumnResize,
                    isColumnDndEnable,
                    isHorizontalReorder: false
                  },
                  header.id
                )) }, headerGroup.id) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(SortableContext, { items: columnOrder, strategy: horizontalListSortingStrategy, children: headerGroup.headers.map(
                  (header) => variant === "default" ? /* @__PURE__ */ jsx(
                    DraggableTableHeader,
                    {
                      header,
                      config: tableConfig,
                      table,
                      onColumnResize,
                      isColumnDndEnable
                    },
                    header.id
                  ) : /* @__PURE__ */ jsx(
                    VisualizationTableHeader,
                    {
                      header,
                      config: tableConfig,
                      table,
                      onColumnResize,
                      isColumnDndEnable
                    },
                    header.id
                  )
                ) }) }, headerGroup.id)
              ) }),
              /* @__PURE__ */ jsxs("tbody", { children: [
                reorderType === "vertical" ? /* @__PURE__ */ jsx(
                  SortableContext,
                  {
                    items: getRowModel().rows.map((row) => row.id),
                    strategy: verticalListSortingStrategy,
                    children: getRowModel().rows.map((row) => {
                      let rowClasses = rowClassName ? rowClassName(row.original) : void 0;
                      if (typeof rowClasses === "string") {
                        rowClasses = [rowClasses];
                      }
                      const mergedClassName = cx(tableStyleMixin(theme).showBorder, rowClasses);
                      return /* @__PURE__ */ jsx(ReorderableRow, { row, className: mergedClassName }, row.id);
                    })
                  }
                ) : getRowModel().rows.map((row) => {
                  const mixins = tableStyleMixin(theme);
                  let rowClasses = rowClassName ? rowClassName(row.original) : void 0;
                  if (typeof rowClasses === "string") {
                    rowClasses = [rowClasses];
                  }
                  const classNames = rowClasses?.map((className2) => {
                    const style = mixins[className2];
                    return typeof style === "string" ? style : void 0;
                  }).filter(Boolean) ?? [];
                  const mergedClassName = cx(mixins.showBorder, ...classNames);
                  return /* @__PURE__ */ jsx("tr", { className: mergedClassName, children: row.getVisibleCells().map((cell) => {
                    const cellValue = cell.getValue();
                    const thresholdMixin = getThresholdMixin(cellValue, theme);
                    const isThresholdMixinDisabled = cell.column.columnDef.meta?.isThresholdMixinDisabled;
                    return /* @__PURE__ */ jsx(SortableContext, { items: columnOrder, strategy: horizontalListSortingStrategy, children: /* @__PURE__ */ jsx(
                      DragAlongCell,
                      {
                        cell,
                        isCompact: reorderType === "none" ? true : isCompact,
                        config: tableConfig,
                        thresholdClass: isThresholdMixinDisabled ? void 0 : thresholdMixin,
                        variant
                      },
                      cell.id
                    ) }, cell.id);
                  }) }, row.id);
                }),
                customRowData && /* @__PURE__ */ jsx("tr", { children: headers.map((header) => {
                  const key = header.id;
                  return /* @__PURE__ */ jsx(CustomRowCell, { header, children: customRowData[key] ?? null }, key);
                }) })
              ] })
            ]
          }
        ) })
      }
    ),
    numberOfPages > 0 && hasPagination && /* @__PURE__ */ jsx(FooterRow, { table, config: tableConfig })
  ] });
};
const getStyles = (theme, variant) => {
  const border = `1px solid ${theme.colors.border.weak}`;
  return {
    tableWrapper: css({
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%"
    }),
    tableContainer: css({
      margin: variant === "default" ? theme.spacing(1.5, 0, 0.5, 0) : 0,
      ...variant === "default" ? { border } : {
        borderTop: border,
        borderBottom: border
      },
      overflow: "auto",
      height: "100%",
      width: "100%",
      thead: {
        position: "sticky",
        top: 0,
        background: variant === "default" ? customColors.tableHeaderBackground : theme.isLight ? customColors.tableHeaderVizLight : customColors.tableHeaderVizDark,
        color: variant === "default" ? customColors.tableHeaderFont : theme.colors.text.primary,
        zIndex: 3
      },
      table: {
        borderCollapse: "separate",
        height: "1px",
        lineHeight: "16px"
      }
    }),
    hideElement: css({
      display: "none"
    })
  };
};
export {
  VuTanStackTable
};
