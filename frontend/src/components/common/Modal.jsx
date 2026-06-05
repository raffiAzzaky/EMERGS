/**
 * components/common/Modal.jsx
 *
 * Reusable modal dialog.
 * Renders via a React Portal so it always sits above all content.
 *
 * Props:
 *  - isOpen      : boolean — controls visibility
 *  - onClose     : () => void — called on backdrop click or close button
 *  - title       : string
 *  - size        : "sm" | "md" | "lg" (default "md")
 *  - hideClose   : boolean — hide the × button
 *  - children    : modal body content
 *  - footer      : React node — custom footer (optional)
 *
 * Usage:
 *  <Modal isOpen={open} onClose={() => setOpen(false)} title="Tambah Kontak">
 *    <p>body content here</p>
 *    <Modal.Footer>
 *      <Button onClick={...}>Simpan</Button>
 *    </Modal.Footer>
 *  </Modal>
 */

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  size      = "md",
  hideClose = false,
  footer,
  children,
}) {
  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose?.(); };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sz = SIZES[size] ?? SIZES.md;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
          relative w-full ${sz}
          bg-card border border-accent/25 rounded-2xl
          shadow-2xl shadow-black/15
          flex flex-col
          max-h-[90vh]
          text-text
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-accent/20 flex-shrink-0">
            {title && (
              <h2 className="text-text font-bold text-base leading-none">{title}</h2>
            )}
            {!hideClose && (
              <button
                onClick={onClose}
                className="ml-auto text-text/65 hover:text-text transition-colors p-0.5"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body — scrollable */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer slot */}
        {footer && (
          <div className="px-6 pb-6 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/**
 * Modal.Footer helper — optional convenience wrapper for button rows.
 */
Modal.Footer = function ModalFooter({ children }) {
  return (
    <div className="flex gap-3 pt-2">
      {children}
    </div>
  );
};

/**
 * Modal.ConfirmDelete — opinionated "Are you sure?" variant.
 *
 * Props:
 *  - isOpen   : boolean
 *  - onClose  : () => void
 *  - onConfirm: () => void
 *  - title    : string (default "Hapus item ini?")
 *  - message  : string
 */
Modal.ConfirmDelete = function ConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  title   = "Hapus item ini?",
  message = "Data ini akan dihapus permanen dan tidak bisa dikembalikan.",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" hideClose>
      <div className="flex flex-col items-center text-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
          <X className="w-6 h-6 text-danger" />
        </div>
        <div>
          <p className="text-text font-bold text-base mb-1">{title}</p>
          <p className="text-text/60 text-sm leading-relaxed">{message}</p>
        </div>
      </div>

      <Modal.Footer>
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-accent/40 text-text text-sm font-semibold hover:bg-accent/10 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={() => { onConfirm?.(); onClose(); }}
          className="flex-1 py-2.5 rounded-xl bg-danger hover:opacity-90 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          Ya, Hapus
        </button>
      </Modal.Footer>
    </Modal>
  );
};
