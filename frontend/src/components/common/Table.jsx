/**
 * components/common/Table.jsx
 *
 * Generic data table used by History and admin monitoring pages.
 *
 * Props:
 *  - columns : Array<{ key, label, width?, render? }>
 *              render(value, row) → ReactNode  (optional custom cell renderer)
 *  - data    : Array<object>   — rows to display
 *  - keyField: string          — unique row identifier field (default "id")
 *  - onRowClick: (row) => void — optional row click handler
 *  - selectedId: any           — id of currently selected row (highlights it)
 *  - emptyMessage: string      — shown when data is empty
 *  - loading : boolean
 *
 * Usage:
 *  <Table
 *    columns={[
 *      { key: "tanggal", label: "Tanggal", width: "1fr" },
 *      { key: "status",  label: "Status",  render: (v) => <Badge>{v}</Badge> },
 *    ]}
 *    data={rows}
 *    keyField="id"
 *    onRowClick={(row) => setSelected(row.id)}
 *    selectedId={selected}
 *  />
 */

import { Search } from "lucide-react";

export default function Table({
  columns      = [],
  data         = [],
  keyField     = "id",
  onRowClick,
  selectedId,
  emptyMessage = "Tidak ada data yang tersedia.",
  loading      = false,
}) {
  // Build grid-template-columns from column widths (default 1fr each)
  const gridCols = columns.map((c) => c.width ?? "1fr").join(" ");

  return (
    <div className="bg-card border border-accent/20 rounded-2xl overflow-hidden shadow-sm">

      {/* ── Header row ── */}
      <div
        className="grid gap-4 px-6 py-3 border-b border-accent/20 bg-accent/10"
        style={{ gridTemplateColumns: gridCols }}
      >
        {columns.map((col) => (
          <span
            key={col.key}
            className="text-text/75 text-xs font-bold uppercase tracking-wider"
          >
            {col.label}
          </span>
        ))}
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="divide-y divide-accent/10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid gap-4 px-6 py-4 animate-pulse"
              style={{ gridTemplateColumns: gridCols }}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="h-4 bg-accent/10 rounded-lg"
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && data.length === 0 && (
        <div className="py-16 flex flex-col items-center gap-3">
          <Search className="w-8 h-8 text-accent" />
          <p className="text-text/60 text-sm">{emptyMessage}</p>
        </div>
      )}

      {/* ── Data rows ── */}
      {!loading && data.length > 0 && (
        <div className="divide-y divide-accent/10">
          {data.map((row, i) => {
            const id       = row[keyField];
            const isSelected = selectedId !== undefined && selectedId === id;
            const isEven   = i % 2 === 0;

            return (
              <div
                key={id ?? i}
                onClick={() => onRowClick?.(row)}
                className={`
                  grid gap-4 px-6 py-4
                  transition-all duration-150
                  ${onRowClick ? "cursor-pointer" : ""}
                  ${isSelected
                    ? "bg-primary/20"
                    : isEven
                      ? "bg-transparent hover:bg-accent/5"
                      : "bg-accent/5 hover:bg-accent/10"
                  }
                `}
                style={{ gridTemplateColumns: gridCols }}
              >
                {columns.map((col) => (
                  <div key={col.key} className="flex items-center min-w-0">
                    {col.render
                      ? col.render(row[col.key], row)
                      : (
                        <span className="text-text text-sm truncate">
                          {row[col.key] ?? "—"}
                        </span>
                      )
                    }
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
