import { useEffect, useMemo, useState } from "react";
import { useTheme2 } from "@grafana/ui";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { marked } from "marked";
import UtilityHeader from "./components/utility/UtilityHeader.jsx";
import { VuTanStackTable } from "./components/tanStackTable/VuTanStackTable.js";
import "./App.css";

function App({ onToggleTheme }) {
  const isChangelog = window.location.pathname === "/changelog";
  const isSnmpVendorPage =
    window.location.pathname === "/snmp-vendor-and-oid-extensibility";
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme2();
  const data = useMemo(
    () => [
      {
        flowName: "SNMP Vendor and OID Extensibility",
      },
    ],
    []
  );
  const columns = useMemo(
    () => [
      {
        id: "flowName",
        accessorKey: "flowName",
        header: "Flow name",
        cell: (info) => {
          const linkColor = theme.colors?.text?.link ?? theme.colors.text.primary;
          return (
            <a
              href="/snmp-vendor-and-oid-extensibility"
              target="_blank"
              rel="noreferrer"
              className="flow-link"
              style={{ color: linkColor }}
            >
              {info.getValue()}
            </a>
          );
        },
      },
    ],
    [theme]
  );
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((column) => column.id ?? column.accessorKey)
  );
  const table = useReactTable({
    data,
    columns,
    state: { columnOrder },
    onColumnOrderChange: setColumnOrder,
    enableColumnResizing: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--app-text", theme.colors.text.primary);
  }, [theme]);

  useEffect(() => {
    if (!isChangelog) {
      return;
    }

    let isMounted = true;
    fetch("/changelog.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load changelog.");
        }
        return response.text();
      })
      .then((text) => {
        if (isMounted) {
          setMarkdown(text);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Changelog is unavailable right now.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isChangelog]);

  const changelogHtml = useMemo(() => marked.parse(markdown), [markdown]);

  return (
    <main
      className={`w-full ${isChangelog ? "changelog-page" : ""}`}
      style={{
        backgroundColor: theme.colors.background.primary,
        color: "var(--app-text)",
        minHeight: "100vh",
      }}
    >
      {!isSnmpVendorPage && <UtilityHeader onToggleTheme={onToggleTheme} />}
      <div className="mx-auto w-full max-w-[640px] pt-24">
        {isChangelog ? (
          <>
            {error ? (
              <p>{error}</p>
            ) : markdown ? (
              <div
                className="changelog"
                dangerouslySetInnerHTML={{ __html: changelogHtml }}
              />
            ) : (
              <p>Loading...</p>
            )}
          </>
        ) : isSnmpVendorPage ? (
          <div
            className="text-xl font-bold text-left"
            style={{ color: theme.colors.text.primary }}
          >
            SNMP Vendor and OID Extensibility
          </div>
        ) : (
          <div className="w-full">
            <div
              className="text-xl font-bold text-left"
              style={{ color: theme.colors.text.primary }}
            >
              vuSmartMaps Rapid Prototyping
            </div>
            <div
              className="text-md text-left"
              style={{ color: theme.colors.text.secondary }}
            >
              This is a Rapid prototyping app built with Vite + React. This
              project is meant to allow designers at VuNet Systems to quickly
              iterate on clickable UI-prototypes to get feedback and alignment.
              At this point in time, we're not expecting to contribute to the
              production codebase, yet.
            </div>
            <VuTanStackTable
              table={table}
              columnOrder={columnOrder}
              config={{ hasPagination: false, hasActionsRow: false }}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
