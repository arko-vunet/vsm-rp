function getSize(size = 10, max = Number.MAX_SAFE_INTEGER, min = 10) {
  return Math.max(Math.min(size, max), min);
}
function calculateTableSizing(columns, totalWidth) {
  let totalAvailableWidth = totalWidth;
  let totalIsGrow = 0;
  for (const header of columns) {
    const column = header.column.columnDef;
    if (column?.meta?.widthPercentage && !column.meta?.isGrow) {
      let calculatedSize = 100;
      calculatedSize = column?.meta?.widthPercentage ? column.meta.widthPercentage * totalWidth * 0.01 : totalWidth / columns.length;
      const size = getSize(calculatedSize, column.maxSize, column.minSize);
      column.size = size;
    }
    if (column.meta?.isGrow) {
      totalIsGrow += 1;
    } else {
      totalAvailableWidth -= getSize(column.size, column.maxSize, column.minSize);
    }
  }
  const sizing = {};
  for (const header of columns) {
    const column = header.column.columnDef;
    if (column.meta?.isGrow) {
      let calculatedSize = 100;
      calculatedSize = Number((totalAvailableWidth / totalIsGrow).toFixed(2));
      const size = getSize(calculatedSize, column.maxSize, column.minSize);
      column.size = size;
    }
    sizing[`${header.id}`] = Number(column.size);
  }
  return sizing;
}
export {
  calculateTableSizing
};
