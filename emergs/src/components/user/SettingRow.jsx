/**
 * components/user/SettingRow.jsx
 *
 * A single tappable row inside a settings group card.
 *
 * Props:
 *  - icon     : ReactNode — lucide icon element
 *  - label    : string
 *  - desc     : string
 *  - isActive : boolean  — highlights the row
 *  - onClick  : () => void
 *  - isLast   : boolean  — omit bottom border on last item
 *  - variant  : "default" | "danger"
 */

import { ChevronRight } from "lucide-react";

export default function SettingRow({
  icon,
  label,
  desc,
  isActive  = false,
  onClick,
  isLast    = false,
  variant   = "default",
}) {
  const isDanger = variant === "danger";

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-5 py-4 text-left group
        transition-all duration-200
        ${!isLast ? "border-b border-accent/15" : ""}
        ${isActive
          ? "bg-primary/20"
          : isDanger
            ? "hover:bg-danger/10"
            : "hover:bg-accent/10"
        }
      `}
    >
      {/* Icon badge */}
      <div
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-text
          transition-colors duration-200
          ${isActive
            ? "bg-primary shadow-sm"
            : isDanger
              ? "bg-danger/10 text-danger group-hover:bg-danger/20"
              : "bg-accent/15 group-hover:bg-accent/25"
          }
        `}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold transition-colors ${
            isDanger
              ? "text-danger"
              : isActive
                ? "text-text font-bold"
                : "text-text"
          }`}
        >
          {label}
        </p>
        {desc && (
          <p className="text-text/60 text-xs mt-0.5">{desc}</p>
        )}
      </div>

      {/* Chevron */}
      {!isDanger && (
        <ChevronRight
          className={`
            w-4 h-4 flex-shrink-0 transition-all duration-200
            ${isActive
              ? "text-primary rotate-90"
              : "text-accent group-hover:text-text"
            }
          `}
        />
      )}
    </button>
  );
}
