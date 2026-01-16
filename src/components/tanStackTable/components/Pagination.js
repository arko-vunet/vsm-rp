import { jsx } from "@emotion/react/jsx-runtime";
import { css, cx } from "@emotion/css";
import { useStyles2 } from "@grafana/ui";
import { useTranslation } from "react-i18next";
import { VuButton } from "../../button/VuButton";
import { VuIcon } from "../../icons/VuIcon";
import usePagination from "../hooks/usePagination";
const Pagination = ({ currentPage, numberOfPages, onNavigate, isHiddenWhenSinglePage, className }) => {
  const styles = useStyles2(getStyles);
  const { t } = useTranslation();
  const { items } = usePagination({
    count: numberOfPages,
    page: currentPage,
    onChange: (_event, page) => onNavigate(page),
    siblingCount: 1,
    boundaryCount: 1
  });
  if (isHiddenWhenSinglePage && numberOfPages <= 1) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: cx(styles.container, className), children: /* @__PURE__ */ jsx("ol", { children: items.map((item, index) => {
    if (item.type === "start-ellipsis" || item.type === "end-ellipsis") {
      return /* @__PURE__ */ jsx("li", { className: styles.item, children: /* @__PURE__ */ jsx(VuIcon, { className: styles.ellipsis, name: "ellipsis-horizontal" }) }, `${item.type}-${index}`);
    }
    let iconName;
    let ariaLabel = t("go_to_page_number", {
      number: item.page
    });
    if (item.type === "previous") {
      iconName = "nav-left";
      ariaLabel = t("previous_page");
    } else if (item.type === "next") {
      iconName = "nav-right";
      ariaLabel = t("next_page");
    }
    return /* @__PURE__ */ jsx("li", { className: styles.item, children: /* @__PURE__ */ jsx(
      VuButton,
      {
        size: "sm",
        variant: item.selected ? "primary" : "secondary",
        fill: "solid",
        onClick: item.handleOnClick,
        disabled: item.disabled,
        "aria-label": ariaLabel,
        className: styles.noFocusStyle,
        children: iconName ? /* @__PURE__ */ jsx(VuIcon, { name: iconName }) : item.page
      }
    ) }, index);
  }) }) });
};
const getStyles = (theme) => {
  return {
    container: css({
      float: "right"
    }),
    item: css({
      display: "inline-block",
      paddingLeft: theme.spacing(1.5),
      marginBottom: theme.spacing(0.75)
    }),
    ellipsis: css({
      display: "inline-block",
      verticalAlign: "bottom"
    }),
    noFocusStyle: css({
      "&:focus, &:focus-visible": {
        boxShadow: "none",
        outline: "none",
        outlineOffset: 0,
        transition: "none"
      }
    })
  };
};
export {
  Pagination
};
