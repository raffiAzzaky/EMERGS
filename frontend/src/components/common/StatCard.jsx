/**
 * components/common/StatCard.jsx
 *
 * Reusable summary/stat card.
 *
 * Props:
 *  - label    : string  — metric label
 *  - value    : string | number
 *  - icon     : ReactNode (lucide icon element)
 *  - variant  : "success" | "danger" | "warning" | "info" | "neutral"
 *  - className: string
 */

const VARIANTS = {
  success: {
    wrapper: "bg-primary/15 border-primary/30",
    icon:    "bg-primary/30",
    text:    "text-text",
  },
  danger: {
    wrapper: "bg-danger/10 border-danger/30",
    icon:    "bg-danger/20",
    text:    "text-danger",
  },
  warning: {
    wrapper: "bg-yellow-500/10 border-yellow-500/30",
    icon:    "bg-yellow-500/20",
    text:    "text-yellow-700",
  },
  info: {
    wrapper: "bg-accent/15 border-accent/30",
    icon:    "bg-accent/30",
    text:    "text-text",
  },
  neutral: {
    wrapper: "bg-card border-accent/20 shadow-sm",
    icon:    "bg-accent/15",
    text:    "text-text/70",
  },
};

export default function StatCard({
  label,
  value,
  icon,
  variant   = "neutral",
  className = "",
}) {
  const v = VARIANTS[variant] ?? VARIANTS.neutral;

  return (
    <div
      className={`
        ${v.wrapper} border rounded-2xl px-5 py-4
        flex items-center gap-4
        ${className}
      `}
    >
      {/* Icon container */}
      {icon && (
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-text
            ${v.icon}
          `}
        >
          {icon}
        </div>
      )}

      {/* Text */}
      <div>
        <p className={`text-xs font-bold uppercase tracking-wider ${v.text}`}>
          {label}
        </p>
        <p className="text-text text-2xl font-bold leading-none mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}