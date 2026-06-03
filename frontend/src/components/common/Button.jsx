/**
 * components/common/Button.jsx
 *
 * Reusable button with variants, sizes, icon support, and loading state.
 *
 * Props:
 *  - variant  : "primary" | "secondary" | "danger" | "ghost" | "outline"
 *  - size     : "sm" | "md" | "lg"
 *  - loading  : boolean
 *  - disabled : boolean
 *  - iconLeft : React element (lucide icon)
 *  - iconRight: React element (lucide icon)
 *  - fullWidth: boolean
 *  - onClick  : function
 *  - type     : "button" | "submit" | "reset"
 *  - className: extra classes
 *  - children : label
 */

const VARIANTS = {
  primary:   "bg-primary hover:opacity-90 text-text shadow-sm border border-primary/20",
  secondary: "bg-accent hover:opacity-90 text-text border border-accent/20",
  danger:    "bg-danger hover:opacity-90 text-white shadow-sm",
  ghost:     "bg-transparent hover:bg-accent/15 text-text",
  outline:   "bg-transparent border border-accent/40 text-text hover:bg-accent/10",
};

const SIZES = {
  sm: "px-3   py-1.5 text-xs  rounded-lg  gap-1.5",
  md: "px-4   py-2.5 text-sm  rounded-xl  gap-2",
  lg: "px-5   py-3   text-sm  rounded-xl  gap-2",
};

export default function Button({
  variant   = "primary",
  size      = "md",
  loading   = false,
  disabled  = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  onClick,
  type      = "button",
  className = "",
  children,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size]       ?? SIZES.md;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200
        hover:scale-[1.02] active:scale-[0.97]
        disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed
        ${v} ${s}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
      )}

      {/* Left icon */}
      {!loading && iconLeft && (
        <span className="flex-shrink-0">{iconLeft}</span>
      )}

      {children}

      {/* Right icon */}
      {!loading && iconRight && (
        <span className="flex-shrink-0">{iconRight}</span>
      )}
    </button>
  );
}
