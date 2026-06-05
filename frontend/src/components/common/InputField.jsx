/**
 * components/common/InputField.jsx
 *
 * Reusable labeled input / textarea / select for forms.
 *
 * Props:
 *  - label      : string
 *  - name       : string
 *  - type       : "text" | "email" | "password" | "tel" | "textarea" | "select"
 *  - value      : string
 *  - onChange   : (e) => void
 *  - placeholder: string
 *  - readOnly   : boolean
 *  - required   : boolean
 *  - error      : string   — validation error message
 *  - children   : ReactNode — <option> elements when type="select"
 *  - rows       : number   — textarea rows (default 2)
 *  - iconLeft   : ReactNode
 *  - className  : string
 */

const BASE_INPUT = `
  w-full rounded-xl px-4 py-2.5 text-sm border transition-all duration-200 focus:outline-none
`;

const EDITABLE   = "bg-card border-accent/40 text-text placeholder-text/40 focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm";
const READ_ONLY  = "bg-background border-accent/20 text-text/60 cursor-default";
const DARK_EDIT  = "bg-card border-accent/40 text-text placeholder-text/40 focus:border-primary focus:ring-2 focus:ring-primary/40 shadow-sm";
const ERROR_RING = "border-danger focus:ring-danger/30";

export default function InputField({
  label,
  name,
  type        = "text",
  value       = "",
  onChange,
  placeholder = "",
  readOnly    = false,
  required    = false,
  error,
  children,
  rows        = 2,
  iconLeft,
  theme       = "dark",   // "dark" (forms on green bg) | "light" (white card)
  className   = "",
}) {
  const colorClass = readOnly
    ? READ_ONLY
    : theme === "light"
      ? EDITABLE
      : DARK_EDIT;

  const errorClass = error ? ERROR_RING : "";

  const sharedProps = {
    id:          name,
    name,
    value,
    onChange,
    readOnly,
    required,
    placeholder,
    className: `${BASE_INPUT} ${colorClass} ${errorClass} ${iconLeft ? "pl-9" : ""} ${className}`,
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={`block text-xs font-bold uppercase tracking-wide mb-1.5 text-text/70`}
        >
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      {/* Input wrapper (for icon) */}
      <div className="relative">
        {iconLeft && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50 pointer-events-none">
            {iconLeft}
          </span>
        )}

        {type === "textarea" ? (
          <textarea rows={rows} {...sharedProps} style={{ resize: "none" }} />
        ) : type === "select" ? (
          <select {...sharedProps} style={{ appearance: "none" }}>
            {children}
          </select>
        ) : (
          <input type={type} {...sharedProps} />
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-danger text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
