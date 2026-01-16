import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { css, cx } from "@emotion/css";
import { colorManipulator } from "@grafana/data";
import { useStyles2 } from "@grafana/ui";
import React from "react";
import { VuIcon } from "../icons/VuIcon";
import { getFocusStyles } from "../misc";
const allButtonVariants = ["primary", "secondary", "destructive"];
const VuButton = React.forwardRef(
  ({
    variant = "primary",
    size = "md",
    fill = "vunet",
    icon,
    fullWidth,
    children,
    className,
    title,
    iconPosition = "before",
    ...otherProps
  }, ref) => {
    const styles = useStyles2(getButtonStyles);
    const btnStyle = styles.button({
      size,
      variant,
      fill,
      fullWidth,
      iconOnly: !children,
      iconPosition
    });
    const iconElement = icon && /* @__PURE__ */ jsx(VuIcon, { name: icon, size, className: btnStyle.icon });
    return /* @__PURE__ */ jsxs("button", { "aria-label": title, title, className: cx(btnStyle.button, className), ...otherProps, ref, children: [
      iconPosition === "before" && iconElement,
      children && /* @__PURE__ */ jsx("span", { className: btnStyle.content, children }),
      iconPosition === "after" && iconElement
    ] });
  }
);
VuButton.displayName = "VuButton";
const getButtonStyles = (theme) => ({
  button: (props) => {
    const { variant, fill = "solid", size, iconOnly, fullWidth, iconPosition = "before" } = props;
    const { height, padding, fontSize } = getPropertiesForButtonSize(size, theme);
    const variantStyles = getPropertiesForVariant(theme, variant, fill);
    const disabledStyles = getPropertiesForDisabled(theme, variant, fill);
    const paddingMinusBorder = theme.spacing.gridSize * padding - 1;
    const focusStyle = getFocusStyles(theme);
    return {
      button: cx(
        css({
          label: "button",
          display: "inline-flex",
          alignItems: "center",
          fontSize,
          fontWeight: theme.typography.fontWeightMedium,
          fontFamily: theme.typography.fontFamily,
          padding: `0 ${paddingMinusBorder}px`,
          height: theme.spacing(height),
          // Deduct border from line-height for perfect vertical centering on windows and linux
          lineHeight: `${theme.spacing.gridSize * height - 2}px`,
          verticalAlign: "middle",
          cursor: "pointer",
          borderRadius: theme.shape.borderRadius(2),
          "&:focus": focusStyle,
          "&:focus-visible": focusStyle,
          // '&:focus:not(:focus-visible)': getMouseFocusStyles(theme),
          ...fullWidth && {
            flexGrow: 1,
            justifyContent: "center"
          },
          ":disabled": disabledStyles,
          "&[disabled]": disabledStyles
        }),
        css(variantStyles)
      ),
      disabled: css(disabledStyles),
      img: css({
        width: theme.spacing(2),
        height: theme.spacing(2),
        margin: theme.spacing(0, 1, 0, 0.5)
      }),
      icon: iconOnly ? css({
        // Important not to set margin bottom here as it would override internal icon bottom margin
        marginRight: theme.spacing(-padding / 2),
        marginLeft: theme.spacing(-padding / 2)
      }) : iconPosition === "before" ? css({
        marginRight: theme.spacing(padding / 2)
      }) : css({
        marginLeft: theme.spacing(padding / 2)
      }),
      content: css({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        whiteSpace: "nowrap",
        height: "100%"
      })
    };
  }
});
function getButtonVariantStyles(theme, color, fill) {
  if (fill === "vunet") {
    return {
      background: "transparent",
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.strong}`,
      transition: theme.transitions.create(["background-color", "border-color", "color"], {
        duration: theme.transitions.duration.short
      }),
      borderRadius: theme.shape.borderRadius(2),
      "&:hover": {
        background: colorManipulator.alpha(
          //   color.main,
          theme.colors.text.primary,
          theme.colors.action.hoverOpacity
        ),
        borderColor: theme.colors.emphasize(theme.colors.border.strong, 0.25),
        color: theme.colors.emphasize(theme.colors.text.primary, 0.25)
      }
    };
  }
  if (fill === "outline") {
    return {
      background: "transparent",
      color: color.text,
      border: `1px solid ${color.border}`,
      transition: theme.transitions.create(["background-color", "border-color", "color"], {
        duration: theme.transitions.duration.short
      }),
      "&:hover": {
        background: colorManipulator.alpha(color.main, theme.colors.action.hoverOpacity),
        borderColor: theme.colors.emphasize(color.border, 0.25),
        color: color.text
      }
    };
  }
  if (fill === "text") {
    return {
      background: "transparent",
      color: color.text,
      border: "1px solid transparent",
      transition: theme.transitions.create(["background-color", "color"], {
        duration: theme.transitions.duration.short
      }),
      "&:focus": {
        outline: "none",
        textDecoration: "none"
      },
      "&:hover": {
        background: colorManipulator.alpha(color.shade, theme.colors.action.hoverOpacity),
        textDecoration: "none"
      }
    };
  }
  return {
    background: color.main,
    color: color.contrastText,
    border: `1px solid transparent`,
    transition: theme.transitions.create(["background-color", "box-shadow", "border-color", "color"], {
      duration: theme.transitions.duration.short
    }),
    "&:hover": {
      background: color.shade,
      color: color.contrastText,
      boxShadow: theme.shadows.z1
    }
  };
}
function getPropertiesForDisabled(theme, variant, fill) {
  const disabledStyles = {
    cursor: "not-allowed",
    boxShadow: "none",
    color: theme.colors.text.disabled,
    transition: "none"
  };
  if (fill === "text") {
    return {
      ...disabledStyles,
      background: "transparent",
      border: `1px solid transparent`
    };
  }
  if (fill === "outline" || fill === "vunet") {
    return {
      ...disabledStyles,
      background: "transparent",
      border: `1px solid ${theme.colors.action.disabledText}`
    };
  }
  return {
    ...disabledStyles,
    background: theme.colors.action.disabledBackground,
    border: `1px solid transparent`
  };
}
function getPropertiesForVariant(theme, variant, fill) {
  switch (variant) {
    case "secondary": {
      return getButtonVariantStyles(theme, theme.colors.secondary, fill);
    }
    case "destructive": {
      return getButtonVariantStyles(theme, theme.colors.error, fill);
    }
    // case 'primary':
    // Default Handles Primary Case too
    default: {
      return getButtonVariantStyles(theme, theme.colors.primary, fill);
    }
  }
}
function getPropertiesForButtonSize(size, theme) {
  switch (size) {
    case "sm": {
      return {
        padding: 1,
        fontSize: theme.typography.size.sm,
        height: theme.components.height.sm
      };
    }
    case "lg": {
      return {
        padding: 3,
        fontSize: theme.typography.size.lg,
        height: theme.components.height.lg
      };
    }
    // Default Handles md Case too
    // case 'md':
    default: {
      return {
        padding: 2,
        fontSize: theme.typography.size.md,
        height: theme.components.height.md
      };
    }
  }
}
export {
  VuButton,
  allButtonVariants,
  getPropertiesForButtonSize,
  getPropertiesForVariant
};
