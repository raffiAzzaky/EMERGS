/**
 * components/user/MedicalCard.jsx
 *
 * Accordion card for a single medical history category.
 * Shows summary when collapsed; expands to show entries.
 *
 * Props:
 *  - category : { id, iconName, label, desc, badge, entries }
 *  - icon     : ReactNode — resolved lucide icon element
 *  - isOpen   : boolean
 *  - onToggle : () => void
 */

import { ChevronDown, RefreshCw } from "lucide-react";
import Badge from "../common/Badge";

export default function MedicalCard({ category, icon, isOpen, onToggle }) {
  const { label, desc, badge, entries = [] } = category;

  return (
    <div
      className={`
        bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-200
        ${isOpen ? "border-primary" : "border-accent/20 hover:border-accent/45"}
      `}
    >
      {/* ── Card header (clickable) ── */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group hover:bg-accent/5 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        {/* Icon */}
        <div
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-text
            transition-colors duration-200
            ${isOpen ? "bg-primary shadow-sm" : "bg-accent/15 group-hover:bg-accent/25"}
          `}
        >
          {icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-text text-sm font-bold">{label}</p>
          <p className="text-text/60 text-xs mt-1">{desc}</p>
        </div>

        {/* Badge + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="success" className="hidden sm:inline-flex">
            {badge}
          </Badge>
          <ChevronDown
            className={`w-4 h-4 text-accent transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* ── Expandable entries ── */}
      {isOpen && (
        <div className="border-t border-accent/15 bg-accent/5">
          {entries.map((entry, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-5 py-3 border-b border-accent/10 last:border-0 hover:bg-accent/10 transition-colors duration-150"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-text text-sm font-semibold">{entry.title}</span>
                  <span className="text-text/50 text-xs flex-shrink-0">{entry.date}</span>
                </div>
                <p className="text-text/65 text-xs leading-relaxed">{entry.note}</p>
              </div>
            </div>
          ))}

          {/* Show all link */}
          <div className="px-5 py-3">
            <button className="text-text hover:text-accent text-xs font-bold transition-colors flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" />
              Lihat semua entri
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
