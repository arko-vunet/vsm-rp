import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { css, cx } from "@emotion/css";
import { Stack, useStyles2 } from "@grafana/ui";
import { useCallback, useImperativeHandle, useRef, useState } from "react";
import * as React from "react";
import { SubMenu } from "./SubMenu";
import { VuIcon } from "../icons/VuIcon";
import { getFocusStyles } from "../misc";
const VuMenuItem = React.memo(
  React.forwardRef((props, ref) => {
    const {
      url,
      icon,
      label,
      description,
      ariaLabel,
      ariaChecked,
      target,
      onClick,
      className,
      active,
      disabled,
      destructive,
      childItems,
      role,
      tabIndex = -1,
      customSubMenuContainerStyles,
      shortcut,
      testId
    } = props;
    const styles = useStyles2(getStyles);
    const [isActive, setIsActive] = useState(active);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const onMouseEnter = useCallback(() => {
      if (disabled) {
        return;
      }
      setIsSubMenuOpen(true);
      setIsActive(true);
    }, [disabled]);
    const onMouseLeave = useCallback(() => {
      if (disabled) {
        return;
      }
      setIsSubMenuOpen(false);
      setIsActive(false);
    }, [disabled]);
    const hasSubMenu = childItems && childItems.length > 0;
    const ItemElement = hasSubMenu ? "div" : url === void 0 ? "button" : "a";
    const itemStyle = cx(
      {
        [styles.item]: true,
        [styles.active]: isActive,
        [styles.disabled]: disabled,
        [styles.destructive]: destructive && !disabled
      },
      className
    );
    const disabledProps = {
      [ItemElement === "button" ? "disabled" : "aria-disabled"]: disabled,
      ...ItemElement === "a" && disabled && { href: void 0, onClick: void 0 },
      ...disabled && {
        tabIndex: -1,
        "data-disabled": disabled
        // used to identify disabled items in Menu.tsx
      }
    };
    const localRef = useRef(null);
    useImperativeHandle(ref, () => localRef.current);
    const handleKeys = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        if (hasSubMenu) {
          setIsSubMenuOpen(true);
          setIsActive(true);
        }
      }
    };
    const closeSubMenu = () => {
      setIsSubMenuOpen(false);
      setIsActive(false);
      localRef?.current?.focus();
    };
    const hasShortcut = Boolean(shortcut && shortcut.length > 0);
    return /* @__PURE__ */ jsxs(
      ItemElement,
      {
        target,
        className: itemStyle,
        rel: target === "_blank" ? "noopener noreferrer" : void 0,
        href: url,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onKeyDown: handleKeys,
        role: url ? role : role || "menuitem",
        "data-role": "menuitem",
        ref: localRef,
        "data-testid": testId,
        "aria-label": ariaLabel,
        "aria-checked": ariaChecked,
        tabIndex,
        ...disabledProps,
        children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "row", justifyContent: "flex-start", alignItems: "center", children: [
            icon && /* @__PURE__ */ jsx(VuIcon, { name: icon, className: styles.icon, "aria-hidden": true }),
            /* @__PURE__ */ jsx("span", { className: styles.ellipsis, children: label }),
            /* @__PURE__ */ jsxs("div", { className: cx(styles.rightWrapper, { [styles.withShortcut]: hasShortcut }), children: [
              hasShortcut && /* @__PURE__ */ jsxs("div", { className: styles.shortcut, children: [
                /* @__PURE__ */ jsx(VuIcon, { name: "keyboard", title: "keyboard shortcut" }),
                shortcut
              ] }),
              hasSubMenu && /* @__PURE__ */ jsx(
                SubMenu,
                {
                  items: childItems,
                  isOpen: isSubMenuOpen,
                  close: closeSubMenu,
                  customStyle: customSubMenuContainerStyles
                }
              )
            ] })
          ] }),
          description && /* @__PURE__ */ jsx(
            "div",
            {
              className: cx(styles.description, styles.ellipsis, {
                [styles.descriptionWithIcon]: icon !== void 0
              }),
              children: description
            }
          ),
          props.component ? /* @__PURE__ */ jsx(props.component, {}) : null
        ]
      }
    );
  })
);
VuMenuItem.displayName = "VuMenuItem";
const getStyles = (theme) => {
  return {
    item: css({
      background: "none",
      cursor: "pointer",
      whiteSpace: "nowrap",
      color: theme.colors.text.primary,
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      padding: theme.spacing(0.5, 2),
      minHeight: theme.spacing(4),
      margin: 0,
      border: "none",
      width: "100%",
      position: "relative",
      "&:hover, &:focus-visible": {
        background: theme.colors.action.hover,
        color: theme.colors.text.primary,
        textDecoration: "none"
      },
      "&:focus-visible": getFocusStyles(theme)
    }),
    active: css({
      background: theme.colors.action.hover
    }),
    destructive: css({
      color: theme.colors.error.text,
      svg: {
        color: theme.colors.error.text
      },
      "&:hover, &:focus, &:focus-visible": {
        background: theme.colors.error.main,
        color: theme.colors.error.contrastText,
        svg: {
          color: theme.colors.error.contrastText
        }
      }
    }),
    disabled: css({
      color: theme.colors.action.disabledText,
      label: "menu-item-disabled",
      "&:hover, &:focus, &:focus-visible": {
        cursor: "not-allowed",
        background: "none",
        color: theme.colors.action.disabledText
      }
    }),
    icon: css({
      opacity: 0.7,
      color: theme.colors.text.secondary
    }),
    rightWrapper: css({
      display: "flex",
      alignItems: "center",
      marginLeft: "auto"
    }),
    withShortcut: css({
      minWidth: theme.spacing(10.5)
    }),
    shortcut: css({
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1),
      marginLeft: theme.spacing(2),
      color: theme.colors.text.secondary,
      opacity: 0.7
    }),
    description: css({
      ...theme.typography.bodySmall,
      color: theme.colors.text.secondary,
      textAlign: "start"
    }),
    descriptionWithIcon: css({
      marginLeft: theme.spacing(3)
    }),
    ellipsis: css({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    })
  };
};
export {
  VuMenuItem
};
