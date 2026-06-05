/**
 * components/user/ContactCard.jsx
 *
 * Displays a single emergency contact.
 * Edit and Delete buttons appear on hover.
 *
 * Props:
 *  - contact : { id, nama, hp, hubungan, prioritas }
 *  - onEdit  : (contact) => void
 *  - onDelete: (id) => void
 */

import { Edit3, Trash2, Phone, PhoneCall } from "lucide-react";
import Badge from "../common/Badge";
import {
  PRIORITY_META,
  HUBUNGAN_EMOJI,
} from "../../data/emergencyContacts";

// Map priority string → Badge variant
const PRIORITY_VARIANT = {
  Utama: "success",
  Medis: "blue",
  Biasa: "neutral",
};

export default function ContactCard({ contact, onEdit, onDelete }) {
  const { id, nama, hp, hubungan, prioritas } = contact;
  const emoji   = HUBUNGAN_EMOJI[hubungan] ?? "👤";
  const variant = PRIORITY_VARIANT[prioritas] ?? "neutral";

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-accent/10 relative group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* ── Action buttons (visible on hover) ── */}
      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit?.(contact)}
          className="w-8 h-8 rounded-lg bg-accent/10 hover:bg-primary/35 flex items-center justify-center transition-colors"
          aria-label={`Edit kontak ${nama}`}
        >
          <Edit3 className="w-3.5 h-3.5 text-text" />
        </button>
        <button
          onClick={() => onDelete?.(id)}
          className="w-8 h-8 rounded-lg bg-danger/10 hover:bg-danger/25 flex items-center justify-center transition-colors"
          aria-label={`Hapus kontak ${nama}`}
        >
          <Trash2 className="w-3.5 h-3.5 text-danger" />
        </button>
      </div>

      {/* ── Avatar + name ── */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-xl flex-shrink-0">
          {emoji}
        </div>
        <div className="min-w-0">
          <p className="text-text font-bold text-sm leading-tight">{nama}</p>
          <p className="text-text/60 text-xs mt-0.5">{hubungan}</p>
        </div>
      </div>

      {/* ── Phone number ── */}
      <div className="flex items-center gap-2 mb-3">
        <Phone className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        <span className="text-text/80 text-sm font-mono font-medium">{hp}</span>
      </div>

      {/* ── Footer: priority badge + call button ── */}
      <div className="flex items-center justify-between">
        <Badge variant={variant} dot>
          {prioritas}
        </Badge>

        <button className="flex items-center gap-1.5 text-text hover:text-accent text-xs font-bold transition-colors">
          <PhoneCall className="w-3.5 h-3.5" />
          Hubungi
        </button>
      </div>
    </div>
  );
}
