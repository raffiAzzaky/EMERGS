/**
 * components/common/TableToolbar.jsx
 *
 * Search bar + filter pill row + optional action button.
 * Used by History page, admin monitoring pages, etc.
 *
 * Props:
 *  - search        : string                  — controlled search value
 *  - onSearch      : (value: string) => void
 *  - placeholder   : string
 *  - filters       : Array<{ label, value }> — pill filter options
 *  - activeFilter  : string                  — currently active filter value
 *  - onFilter      : (value: string) => void
 *  - actions       : ReactNode               — right-side action buttons (optional)
 *  - resultCount   : number                  — shown in footer text
 *  - totalCount    : number
 */

import { Search, Filter } from "lucide-react";

export default function TableToolbar({
  search       = "",
  onSearch,
  placeholder  = "Cari...",
  filters      = [],
  activeFilter,
  onFilter,
  actions,
  resultCount,
  totalCount,
}) {
  return (
    <div className="space-y-2">
      {/* ── Main toolbar row ── */}
      <div className="bg-card border border-accent/20 rounded-2xl px-4 py-3 flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between shadow-sm">

        {/* Search input */}
        <div className="relative flex-1 w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-card border border-accent/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-text placeholder-text/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter pills */}
          {filters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-text/50 flex-shrink-0" />
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onFilter?.(f.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeFilter === f.value
                      ? "bg-primary text-text shadow-sm"
                      : "bg-accent/15 text-text/80 hover:bg-accent/30 hover:text-text"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* Slot for extra action buttons (e.g. Export) */}
          {actions}
        </div>
      </div>

      {/* ── Result count footer ── */}
      {resultCount !== undefined && totalCount !== undefined && (
        <p className="text-text/60 text-xs px-1">
          Menampilkan{" "}
          <span className="text-text font-bold">{resultCount}</span> dari{" "}
          <span className="text-text font-bold">{totalCount}</span> data
        </p>
      )}
    </div>
  );
}
