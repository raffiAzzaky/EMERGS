/**
 * components/common/Badge.jsx
 *
 * Reusable status/label badge.
 *
 * Props:
 *  - variant : "success" | "danger" | "warning" | "info" | "neutral" | "blue" | "purple"
 *  - dot     : boolean — show animated dot indicator (default false)
 *  - size    : "sm" | "md" (default "sm")
 *  - children: label text
 *  - className: extra classes
 */

const VARIANTS = {
  success: "bg-primary/20 text-text border-primary/40",
  danger:  "bg-danger/10 text-danger border-danger/30",
  warning: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
  info:    "bg-accent/25 text-text border-accent/40",
  neutral: "bg-accent/10 text-text/80 border-accent/20",
  blue:    "bg-blue-500/10 text-blue-700 border-blue-500/30",
  purple:  "bg-purple-500/10 text-purple-700 border-purple-500/30",
};

const DOT_COLORS = {
  success: "bg-primary",
  danger:  "bg-danger",
  warning: "bg-yellow-500",
  info:    "bg-accent",
  neutral: "bg-text/60",
  blue:    "bg-blue-500",
  purple:  "bg-purple-500",
};

const SIZES = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3    py-1.5 text-sm",
};

export default function Badge({
  variant = "neutral",
  dot = false,
  size = "sm",
  children,
  className = "",
}) {
  const base = VARIANTS[variant] ?? VARIANTS.neutral;
  const sz   = SIZES[size]       ?? SIZES.sm;
  const dotColor = DOT_COLORS[variant] ?? DOT_COLORS.neutral;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold border
        ${base} ${sz} ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
      )}
      {children}
    </span>
  );
}
