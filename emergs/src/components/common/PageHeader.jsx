/**
 * components/common/PageHeader.jsx
 *
 * Consistent page header used at the top of every page.
 *
 * Props:
 *  - title    : string
 *  - subtitle : string (optional)
 *  - actions  : ReactNode — right-side action buttons (optional)
 *  - className: string
 */

export default function PageHeader({ title, subtitle, actions, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div>
        <h1 className="text-text text-xl font-bold leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-text/70 text-sm mt-1 font-medium">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
