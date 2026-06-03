/**
 * components/common/SectionDivider.jsx
 *
 * Horizontal rule with a centered label.
 * Used in Profile, Settings, and Medical History pages.
 *
 * Props:
 *  - label    : string
 *  - className: string
 */

export default function SectionDivider({ label, className = "" }) {
  return (
    <div className={`flex items-center gap-3 my-6 ${className}`}>
      <div className="flex-1 h-px bg-accent/30" />
      {label && (
        <span className="text-text/60 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-accent/30" />
    </div>
  );
}
