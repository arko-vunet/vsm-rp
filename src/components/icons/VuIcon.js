import { jsx } from "@emotion/react/jsx-runtime";
import { css, cx } from "@emotion/css";
import { useStyles2 } from "@grafana/ui";
import React from "react";
import Svg from "react-inlinesvg";
const prependGrafanaBasePath = (path) => path;
const iconRoot = "/public/plugins/vunet-datasource/assets/img/icons/";
const VuIcon = React.forwardRef(
  ({ size = "md", name, className, style, title = "", ...divElementProps }, ref) => {
    const styles = useStyles2(getStyles);
    const svgSize = getSvgSize(size);
    const svgPath = getSvgPath(name);
    return /* @__PURE__ */ jsx("div", { className: styles.container, ...divElementProps, tabIndex: -1, ref, children: /* @__PURE__ */ jsx(
      Svg,
      {
        src: svgPath,
        width: svgSize,
        height: svgSize,
        title,
        className: cx(styles.icon, className),
        style
      }
    ) });
  }
);
VuIcon.displayName = "VuIcon";
const getSvgSize = (size) => {
  switch (size) {
    case "xs": {
      return 12;
    }
    case "sm": {
      return 14;
    }
    case "md": {
      return 16;
    }
    case "lg": {
      return 18;
    }
    case "xl": {
      return 24;
    }
    case "xxl": {
      return 36;
    }
    case "xxxl": {
      return 48;
    }
  }
};
const getStyles = () => {
  return {
    container: css({
      label: "Icon",
      display: "inline-block"
    }),
    icon: css({
      verticalAlign: "middle",
      display: "inline-block",
      fill: "currentColor"
    })
  };
};
const getSvgPath = (name) => prependGrafanaBasePath(`${iconRoot}${name}.svg`);
export {
  VuIcon,
  getSvgPath,
  getSvgSize
};
