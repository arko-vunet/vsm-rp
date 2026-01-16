import { jsx } from "@emotion/react/jsx-runtime";
import { css, cx } from "@emotion/css";
import { colorManipulator } from "@grafana/data";
import { useStyles2 } from "@grafana/ui";
import React from "react";
import { VuIcon } from "../icons/VuIcon";
import { getFocusStyles, getMouseFocusStyles } from "../misc";
const VuIconButton = React.forwardRef(
  (
    { name, icon, ariaLabel, variant = "secondary", className, toolTip, ...restProps },
    ref
  ) => {
    const styles = useStyles2(getStyles);
    const title = toolTip ?? name ?? ariaLabel;
    const iconElement = icon ? /* @__PURE__ */ jsx("span", { className: styles.icon, children: icon }) : /* @__PURE__ */ jsx(VuIcon, { name, className: styles.icon });
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        "aria-label": ariaLabel ?? title,
        ...restProps,
        className: cx(styles.button(variant), className),
        title,
        children: iconElement
      }
    );
  }
);
VuIconButton.displayName = "VuIconButton";
const getStyles = (theme) => {
  const iconColor = theme.colors.text.primary;
  const pixelSize = 24;
  const hoverSize = Math.max(pixelSize / 3, 8);
  return {
    button: (variant) => css`
      width: ${pixelSize}px;
      height: ${pixelSize}px;
      background: transparent;
      border: none;
      color: ${iconColor};
      padding: 0;
      margin: 0;
      outline: none;
      box-shadow: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: ${theme.shape.borderRadius()};
      z-index: 0;
      margin-right: ${theme.spacing(0.5)};

      &[disabled],
      &:disabled {
        cursor: not-allowed;
        color: ${theme.colors.action.disabledText};
        opacity: 0.65;
        box-shadow: none;
      }

      &:before {
        content: '';
        display: block;
        opacity: 1;
        position: absolute;
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        z-index: -1;
        bottom: -${hoverSize}px;
        left: -${hoverSize}px;
        right: -${hoverSize}px;
        top: -${hoverSize}px;
        background: none;
        border-radius: 50%;
        box-sizing: border-box;
        transform: scale(0);
        transition-property: transform, opacity;
      }

      &:focus,
      &:focus-visible {
        ${getFocusStyles(theme)}
      }

      &:focus:not(:focus-visible) {
        ${getMouseFocusStyles()}
      }

      &:hover {
        color: ${iconColor};

        &:before {
          background-color: ${variant === "secondary" ? theme.colors.action.hover : colorManipulator.alpha(iconColor, 0.12)};
          border: none;
          box-shadow: none;
          opacity: 1;
          transform: scale(0.8);
        }
      }
    `,
    icon: css`
      margin-bottom: 0;
      vertical-align: baseline;
      display: flex;
    `
  };
};
export {
  VuIconButton
};
