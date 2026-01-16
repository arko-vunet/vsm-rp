var SortOrder = /* @__PURE__ */ ((SortOrder2) => {
  SortOrder2["Asc"] = "asc";
  SortOrder2["Desc"] = "desc";
  return SortOrder2;
})(SortOrder || {});
const getHeaderTooltip = (canSort, isSorted, nextOrder, t) => {
  if (!canSort) {
    return void 0;
  }
  if (!isSorted) {
    if (nextOrder === "asc" /* Asc */) {
      return t("unsorted_tooltip", { order: t("ascending").toLowerCase() });
    } else if (nextOrder === "desc" /* Desc */) {
      return t("unsorted_tooltip", { order: t("descending").toLowerCase() });
    }
  }
  if (isSorted === "asc" /* Asc */) {
    if (nextOrder === "desc" /* Desc */) {
      return t("sorted_toggle_tooltip", {
        order_current: t("ascending").toLowerCase(),
        order_next: t("descending").toLowerCase()
      });
    } else if (nextOrder === false) {
      return t("sorted_clear_tooltip", {
        order: t("ascending").toLowerCase()
      });
    }
  }
  if (isSorted === "desc" /* Desc */) {
    if (nextOrder === "asc" /* Asc */) {
      return t("sorted_toggle_tooltip", {
        order_current: t("descending").toLowerCase(),
        order_next: t("ascending").toLowerCase()
      });
    } else if (nextOrder === false) {
      return t("sorted_clear_tooltip", {
        order: t("descending").toLowerCase()
      });
    }
  }
  return t("click_to_sort");
};
export {
  getHeaderTooltip
};
