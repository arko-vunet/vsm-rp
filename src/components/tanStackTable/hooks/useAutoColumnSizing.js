import { useLayoutEffect } from "react";
import { ActionColumnID } from "../constants";
import { calculateTableSizing } from "../utils/calculateTableSizing";
function useAutoColumnSizing({
  headers,
  setColumnSizing,
  tableContainerRef,
  forceRenderCount,
  isTableResized,
  isResizingEnable = true,
  isSkipAutoSizing = false
}) {
  useLayoutEffect(() => {
    if (!tableContainerRef.current || !isResizingEnable) {
      return;
    }
    const BORDER_OFFSET = 2;
    const SCROLLBAR_OFFSET = 6;
    const MIN_COLUMN_WIDTH = 150;
    const columnsWithoutAction = headers.filter((header) => header.id !== ActionColumnID);
    const getAdjustedTotalWidth = () => tableContainerRef.current.clientWidth - BORDER_OFFSET - SCROLLBAR_OFFSET;
    const sumValues = (obj) => Object.values(obj).reduce((sum, value) => sum + value, 0);
    const addColumn = (prev, totalWidth2) => {
      const totalPrev = sumValues(prev);
      const availableSpace = totalWidth2 - totalPrev;
      const addedColumnId = headers.find((item) => !(item.id in prev))?.id;
      if (!addedColumnId) {
        return prev;
      }
      return {
        ...prev,
        [addedColumnId]: Math.max(MIN_COLUMN_WIDTH, availableSpace)
      };
    };
    const removeColumn = (prev, totalWidth2) => {
      const headerIds = new Set(headers.map((item) => item.id));
      const removedColumnId = Object.keys(prev).find((key) => !headerIds.has(key));
      if (!removedColumnId) {
        return prev;
      }
      const lastColumnId = columnsWithoutAction[columnsWithoutAction.length - 1]?.id;
      if (!lastColumnId || !(lastColumnId in prev)) {
        return prev;
      }
      const prevCopy = { ...prev };
      delete prevCopy[removedColumnId];
      const totalPrevCopy = sumValues(prevCopy);
      const availableSpace = totalWidth2 - totalPrevCopy;
      return availableSpace > MIN_COLUMN_WIDTH ? {
        ...prevCopy,
        [lastColumnId]: prev[lastColumnId] + availableSpace
      } : prevCopy;
    };
    const totalWidth = getAdjustedTotalWidth();
    setColumnSizing((prev) => {
      if (isSkipAutoSizing && Object.keys(prev).length > 0) {
        return prev;
      }
      const prevKeys = Object.keys(prev);
      if (prevKeys.length === 0 || !isTableResized) {
        return calculateTableSizing(headers, totalWidth);
      }
      if (headers.length > prevKeys.length) {
        return addColumn(prev, totalWidth);
      }
      if (headers.length < prevKeys.length) {
        return removeColumn(prev, totalWidth);
      }
      return prev;
    });
  }, [
    headers,
    isResizingEnable,
    isTableResized,
    setColumnSizing,
    isSkipAutoSizing,
    tableContainerRef,
    forceRenderCount
  ]);
}
export {
  useAutoColumnSizing
};
