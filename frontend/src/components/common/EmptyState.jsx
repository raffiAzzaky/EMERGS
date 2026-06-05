/**
 * components/common/EmptyState.jsx
 *
 * Displayed when a list, table, or section has no data.
 *
 * Props:
 *  - icon    : ReactNode  — lucide icon element
 *  - title   : string
 *  - message : string     — supporting text
 *  - action  : ReactNode  — optional CTA button
 */

export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-card border border-accent/20 flex items-center justify-center shadow-sm text-accent">
          {icon}
        </div>
      )}

      {title && (
        <p className="text-text font-bold text-base">{title}</p>
      )}

      {message && (
        <p className="text-text/60 text-sm text-center max-w-xs leading-relaxed">
          {message}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
