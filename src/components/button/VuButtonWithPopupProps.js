import { Fragment, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { Popover, PopoverController } from "@grafana/ui";
import { createRef } from "react";
import { VuButton } from "./VuButton";
const voidFn = () => {
};
const VuButtonWithPopup = ({ popupContent, children, ...restBtnProps }) => {
  const pickerTriggerRef = createRef();
  return /* @__PURE__ */ jsx(
    PopoverController,
    {
      placement: "bottom",
      content: () => popupContent(voidFn),
      children: (showPopper, hidePopper, popperProps) => {
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          pickerTriggerRef.current && /* @__PURE__ */ jsx(
            Popover,
            {
              show: popperProps.show,
              placement: popperProps.placement,
              content: () => popupContent(hidePopper),
              onChange: hidePopper,
              referenceElement: pickerTriggerRef.current,
              onMouseLeave: hidePopper,
              onMouseEnter: showPopper,
              onKeyDown: (event) => closePopover(event, hidePopper)
            }
          ),
          /* @__PURE__ */ jsx(
            VuButton,
            {
              ref: pickerTriggerRef,
              ...restBtnProps,
              onClick: (e) => {
                e.stopPropagation();
                popperProps.show ? hidePopper() : showPopper();
              },
              children
            }
          )
        ] });
      }
    }
  );
};
const closePopover = (event, hidePopper) => {
  if (event.key === "Tab" || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }
  event.stopPropagation();
  if (event.key === "Escape") {
    hidePopper();
  }
};
export {
  VuButtonWithPopup,
  closePopover
};
