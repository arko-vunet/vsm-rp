import { Fragment, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { css } from "@emotion/css";
import { Select, useStyles2 } from "@grafana/ui";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pagination } from "./Pagination";
import { VuRow } from "../../grid/VuGrid";
const PageSizes = [10, 20, 50, 100, 200, 500, 1e3];
const FooterRow = ({ table, config }) => {
  const styles = useStyles2(getStyles);
  const { t } = useTranslation();
  const {
    options,
    getPageCount,
    getFilteredRowModel,
    getRowCount,
    setPageIndex,
    setPageSize,
    setRowSelection,
    getState
  } = table;
  const { pageIndex, pageSize } = getState().pagination;
  const isServerSide = options.manualPagination || options.manualFiltering || options.manualSorting;
  const numberOfPages = getPageCount();
  const totalRecords = isServerSide ? getRowCount() : getFilteredRowModel().rows.length;
  const startRecord = totalRecords === 0 ? 0 : pageIndex * pageSize + 1;
  const endRecord = Math.min((pageIndex + 1) * pageSize, totalRecords);
  const { hasRowsPerPageOption } = config;
  const pageSizeOptions = useMemo(() => {
    return [.../* @__PURE__ */ new Set([...PageSizes, pageSize])].filter((pSize, i, n) => i === 0 || pSize === pageSize || n[i - 1] < totalRecords).sort((a, b) => a - b).map((a) => ({
      value: a,
      label: `${a} ${t("item")}`
    }));
  }, [pageSize, totalRecords, t]);
  return /* @__PURE__ */ jsxs(VuRow, { justify: "space-between", alignItems: "center", className: styles.container, children: [
    /* @__PURE__ */ jsx("span", { className: styles.noWrap, children: t("showing_records", {
      firstRecord: startRecord.toLocaleString(),
      lastRecord: endRecord.toLocaleString(),
      totalRecords: totalRecords.toLocaleString()
    }) }),
    /* @__PURE__ */ jsxs(VuRow, { alignItems: "center", children: [
      hasRowsPerPageOption && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { children: t`show` }),
        /* @__PURE__ */ jsx(
          Select,
          {
            className: styles.minWidth(100),
            value: pageSize,
            options: pageSizeOptions,
            menuPlacement: "top",
            onChange: ({ value = 10 }) => setPageSize(value),
            placeholder: t`set_page_size`
          }
        )
      ] }),
      numberOfPages > 1 && /* @__PURE__ */ jsx(
        Pagination,
        {
          className: styles.noWrap,
          currentPage: pageIndex + 1,
          numberOfPages,
          onNavigate: (toPage) => {
            setPageIndex(toPage - 1);
            if (Object.keys(getState().rowSelection).length > 0) {
              setRowSelection({});
            }
          }
        }
      )
    ] })
  ] });
};
const getStyles = (theme) => ({
  container: css({
    overflow: "auto hidden",
    padding: theme.spacing(1)
  }),
  noWrap: css({ whiteSpace: "nowrap" }),
  minWidth: (minWidth) => css({ minWidth })
});
export {
  FooterRow
};
