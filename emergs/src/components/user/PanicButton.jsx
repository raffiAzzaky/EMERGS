/**
 * components/user/PanicButton.jsx
 *
 * Large circular emergency panic button with animated pulse rings.
 *
 * Props:
 *  - onPress  : () => void — called when button is pressed
 *  - active   : boolean   — true while sending signal
 */

import { MapPin } from "lucide-react";

export default function PanicButton({ onPress, active = false }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Label */}
      <p className="text-text/60 text-xs font-bold mb-6 tracking-widest uppercase">
        Tombol Darurat
      </p>

      {/* Rings + Button container */}
      <div className="relative flex items-center justify-center w-64 h-64">

        {/* Ring 3 — outermost */}
        <div
          className={`
            absolute w-60 h-60 rounded-full border
            transition-colors duration-300
            ${active
              ? "border-danger/30 animate-ping"
              : "border-primary/40 animate-[ping_2.5s_ease-in-out_infinite]"
            }
          `}
        />

        {/* Ring 2 */}
        <div
          className={`
            absolute w-52 h-52 rounded-full border
            transition-colors duration-300
            ${active
              ? "border-danger/40 animate-ping"
              : "border-primary/50 animate-[ping_2s_ease-out_infinite]"
            }
          `}
        />

        {/* Ring 1 — innermost */}
        <div
          className={`
            absolute w-44 h-44 rounded-full border-2
            transition-all duration-300
            ${active
              ? "border-danger/50 scale-110"
              : "border-primary/60"
            }
          `}
        />

        {/* Button */}
        <button
          onClick={onPress}
          aria-label="Tombol Panic — tekan saat darurat"
          className={`
            relative w-36 h-36 rounded-full
            flex flex-col items-center justify-center gap-1
            shadow-xl transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-primary/50
            ${active
              ? "bg-danger scale-95 shadow-danger/30 cursor-not-allowed"
              : "bg-primary hover:bg-white hover:scale-105 shadow-primary/30 cursor-pointer border-2 border-primary/20"
            }
          `}
          disabled={active}
        >
          {/* Hover glow layer */}
          {!active && (
            <div className="absolute inset-0 rounded-full animate-pulse bg-primary/10" />
          )}

          <MapPin
            className={`w-12 h-12 transition-colors duration-300 ${
              active ? "text-white" : "text-text"
            }`}
          />
          <span
            className={`text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
              active ? "text-white" : "text-text"
            }`}
          >
            {active ? "Mengirim..." : "PANIC"}
          </span>
        </button>
      </div>

      {/* Status message */}
      <p
        className={`mt-6 text-sm font-semibold transition-colors duration-300 ${
          active ? "text-danger" : "text-text/75"
        }`}
      >
        {active
          ? "🚨 Sinyal darurat dikirim ke kontak Anda!"
          : "Tekan tombol jika dalam kondisi darurat"}
      </p>
    </div>
  );
}
