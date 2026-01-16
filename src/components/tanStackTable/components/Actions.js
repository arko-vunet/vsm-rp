import { jsx } from "@emotion/react/jsx-runtime";
import { Dropdown, Menu } from "@grafana/ui";
import { VuButton } from "../../button/VuButton";
import { VuMenuItem } from "../../menuItem";
function getIsDisabled(config, selectedData, selectionCount) {
  const disabledByProp = typeof config.isDisabled === "boolean" ? config.isDisabled : config.isDisabled?.(selectedData) ?? false;
  const disabledBySelection = !config.isIndependent && selectionCount < (config.minimumSelection ?? 1);
  return disabledByProp || disabledBySelection;
}
const Actions = ({
  action,
  selectedData,
  selectionCount
}) => {
  if (action.type === "dropdown") {
    const isDropdownDisabled = getIsDisabled(action, selectedData, selectionCount);
    return /* @__PURE__ */ jsx(
      Dropdown,
      {
        overlay: /* @__PURE__ */ jsx(Menu, { children: action.items.map((item, j) => {
          const isItemDisabled = getIsDisabled(item, selectedData, selectionCount);
          const handleClick2 = () => {
            if (isItemDisabled) {
              return;
            }
            item.isIndependent ? item.onClick() : item.onClick(selectedData);
          };
          return /* @__PURE__ */ jsx(
            VuMenuItem,
            {
              label: item.label,
              icon: item.icon,
              destructive: item.destructive,
              disabled: isItemDisabled,
              onClick: handleClick2
            },
            `menu-item-${j}`
          );
        }) }),
        children: /* @__PURE__ */ jsx(
          VuButton,
          {
            variant: action.variant ?? "secondary",
            icon: action.icon ?? "angle-down",
            title: action.tooltip ?? action.title,
            size: action.size,
            fill: action.fill,
            disabled: isDropdownDisabled,
            iconPosition: action.iconPosition,
            children: action.withText && action.title
          }
        )
      }
    );
  }
  const isButtonDisabled = getIsDisabled(action, selectedData, selectionCount);
  const handleClick = () => {
    if (isButtonDisabled) {
      return;
    }
    action.isIndependent ? action.onClick() : action.onClick(selectedData);
  };
  return /* @__PURE__ */ jsx(
    VuButton,
    {
      title: action.tooltip ?? action.title,
      icon: action.icon,
      size: action.size,
      variant: action.variant,
      fill: action.fill,
      disabled: isButtonDisabled,
      type: "button",
      onClick: handleClick,
      children: action.withText && action.title
    }
  );
};
export {
  Actions
};
