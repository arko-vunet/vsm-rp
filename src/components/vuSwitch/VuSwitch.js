import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { Switch } from "@grafana/ui";
import { VuRow } from "../grid/VuGrid";
const VuSwitch = ({ label, isChecked, handleValueChange, className }) => {
  return /* @__PURE__ */ jsxs(VuRow, { alignItems: "center", className, children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsx(Switch, { value: isChecked, onChange: (e) => handleValueChange(e.currentTarget.checked) })
  ] });
};
export {
  VuSwitch
};
