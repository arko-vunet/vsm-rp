import { Fragment, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { css, cx } from "@emotion/css";
import { selectors } from "@grafana/e2e-selectors";
import { useStyles2 } from "@grafana/ui";
import { memo, useEffect, useRef, useState } from "react";
import { useMenuFocus } from "./hooks/useMenuFocus";
import { isElementOverflowing } from "./utils/isElementOverflowing";
import { VuIcon } from "../icons/VuIcon";
const SubMenu = memo(({ items, isOpen, close, customStyle }) => {
  const styles = useStyles2(getStyles);
  const localRef = useRef(null);
  const [handleKeys] = useMenuFocus({
    localRef,
    isMenuOpen: isOpen,
    close
  });
  const [pushLeft, setPushLeft] = useState(false);
  useEffect(() => {
    if (isOpen && localRef.current) {
      setPushLeft(isElementOverflowing(localRef.current));
    }
  }, [isOpen]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: styles.iconWrapper, "aria-hidden": true, "data-testid": selectors.components.Menu.SubMenu.icon, children: /* @__PURE__ */ jsx(VuIcon, { name: "angle-right", className: styles.icon }) }),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        ref: localRef,
        className: cx(styles.subMenu, { [styles.pushLeft]: pushLeft }),
        "data-testid": selectors.components.Menu.SubMenu.container,
        style: customStyle,
        children: /* @__PURE__ */ jsx("div", { tabIndex: -1, className: styles.itemsWrapper, role: "menu", onKeyDown: handleKeys, children: items })
      }
    )
  ] });
});
SubMenu.displayName = "SubMenu";
const getStyles = (theme) => {
  return {
    iconWrapper: css({
      display: "flex",
      flex: 1,
      justifyContent: "end"
    }),
    icon: css({
      opacity: 0.7,
      marginLeft: theme.spacing(1),
      color: theme.colors.text.secondary
    }),
    itemsWrapper: css({
      background: theme.colors.background.primary,
      boxShadow: theme.shadows.z3,
      display: "inline-block",
      borderRadius: theme.shape.radius.default
    }),
    pushLeft: css({
      right: "100%",
      left: "unset"
    }),
    subMenu: css({
      position: "absolute",
      top: 0,
      left: "100%",
      zIndex: theme.zIndex.dropdown
    })
  };
};
export {
  SubMenu
};
