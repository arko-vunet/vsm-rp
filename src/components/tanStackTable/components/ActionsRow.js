import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { css } from "@emotion/css";
import { useStyles2 } from "@grafana/ui";
import { useTranslation } from "react-i18next";
import { Actions } from "./Actions";
import { VuRow } from "../../grid/VuGrid";
import { VuSwitch } from "../../vuSwitch";
const ActionsRow = ({
  groupActions,
  selectedRows,
  config,
  customControls,
  isCompact,
  setCompact
}) => {
  const { t } = useTranslation();
  const styles = useStyles2(getStyles);
  const { hasExpandedRows, expandRowsSwitchLabel } = config;
  const selectedData = selectedRows.map((row) => row.original);
  const selectionCount = selectedData.length;
  return /* @__PURE__ */ jsxs(VuRow, { justify: "space-between", className: styles.rowContainer, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          visibility: customControls ? "visible" : "hidden"
        },
        children: customControls
      }
    ),
    /* @__PURE__ */ jsxs(VuRow, { alignItems: "center", className: styles.rowGap, children: [
      hasExpandedRows && /* @__PURE__ */ jsx(
        VuSwitch,
        {
          label: expandRowsSwitchLabel ?? t("expand_entity", {
            entity: t`row`
          }),
          isChecked: isCompact,
          handleValueChange: () => setCompact((prev) => !prev),
          className: styles.expandRowsSwitch
        }
      ),
      groupActions?.map((action, i) => /* @__PURE__ */ jsx(Actions, { action, selectedData, selectionCount }, `action-${i}`))
    ] })
  ] });
};
const getStyles = (theme) => ({
  rowContainer: css({
    padding: theme.spacing(0.5)
  }),
  rowGap: css({
    gap: theme.spacing(2)
  }),
  expandRowsSwitch: css({
    padding: theme.spacing(0, 1),
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: theme.shape.borderRadius(2),
    height: 24
  })
});
export {
  ActionsRow
};
