/**
 * components/user/MedicalCard.jsx
 *
 * Accordion card for a single medical history category.
 * Shows summary when collapsed; expands to show entries.
 *
 * Props:
 *  - category : { id, iconName, label, desc, badge, entries, isManageable }
 *  - icon     : ReactNode — resolved lucide icon element
 *  - isOpen   : boolean
 *  - onToggle : () => void
 *  - onAddEntry: (type, payload) => Promise<void>
 *  - onDeleteEntry: (type, id) => Promise<void>
 */

import { useState } from "react";
import { ChevronDown, Trash, Plus } from "lucide-react";
import Badge from "../common/Badge";

export default function MedicalCard({ category, icon, isOpen, onToggle, onAddEntry, onDeleteEntry }) {
  const { id, label, desc, badge, entries = [], isManageable } = category;

  const [formData, setFormData] = useState({
    name: "", severity: "Mild", notes: "",
    dosage: "", frequency: "", note: ""
  });
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id === "alergi" && !formData.name) return;
    if (id === "obat" && !formData.name) return;
    if (id === "catatan" && !formData.note) return;

    setAdding(true);
    try {
      await onAddEntry(id, formData);
      setFormData({ name: "", severity: "Mild", notes: "", dosage: "", frequency: "", note: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className={`
        bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-200
        ${isOpen ? "border-primary" : "border-accent/20 hover:border-accent/45"}
      `}
    >
      {/* ── Card header (clickable) ── */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group hover:bg-accent/5 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        {/* Icon */}
        <div
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-text
            transition-colors duration-200
            ${isOpen ? "bg-primary shadow-sm" : "bg-accent/15 group-hover:bg-accent/25"}
          `}
        >
          {icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-text text-sm font-bold">{label}</p>
          <p className="text-text/60 text-xs mt-1">{desc}</p>
        </div>

        {/* Badge + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="success" className="hidden sm:inline-flex">
            {badge}
          </Badge>
          <ChevronDown
            className={`w-4 h-4 text-accent transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* ── Expandable entries ── */}
      {isOpen && (
        <div className="border-t border-accent/15 bg-accent/5">
          {entries.length === 0 ? (
            <p className="text-text/50 text-xs p-5 italic">Belum ada entri terdaftar.</p>
          ) : (
            entries.map((entry, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-5 py-3 border-b border-accent/10 last:border-0 hover:bg-accent/10 transition-colors duration-150"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-text text-sm font-semibold">{entry.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-text/50 text-xs flex-shrink-0">{entry.date}</span>
                      {isManageable && onDeleteEntry && (
                        <button
                          onClick={() => onDeleteEntry(id, entry.id)}
                          className="text-text/40 hover:text-danger p-1 rounded transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-text/65 text-xs leading-relaxed">{entry.note}</p>
                </div>
              </div>
            ))
          )}

          {/* Manage Form Inside Accordion */}
          {isManageable && onAddEntry && (
            <div className="px-5 py-4 border-t border-accent/15 bg-white">
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text/60">Tambah Entri Baru</p>
                {id === "alergi" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Alergen (cth: Kacang)"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-1 rounded-xl border border-accent/25 px-3 py-1.5 text-xs text-text outline-none focus:border-primary"
                      required
                    />
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      className="col-span-1 rounded-xl border border-accent/25 px-3 py-1.5 text-xs text-text outline-none focus:border-primary bg-white"
                    >
                      <option value="Mild">Ringan (Mild)</option>
                      <option value="Moderate">Sedang (Moderate)</option>
                      <option value="Severe">Parah (Severe)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Catatan reaksi"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="col-span-1 rounded-xl border border-accent/25 px-3 py-1.5 text-xs text-text outline-none focus:border-primary"
                    />
                  </div>
                )}
                {id === "obat" && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Obat"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-1 rounded-xl border border-accent/25 px-3 py-1.5 text-xs text-text outline-none focus:border-primary"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Dosis (cth: 5mg)"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      className="col-span-1 rounded-xl border border-accent/25 px-3 py-1.5 text-xs text-text outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Frekuensi (cth: 1x1)"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="col-span-1 rounded-xl border border-accent/25 px-3 py-1.5 text-xs text-text outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Keterangan"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="col-span-1 rounded-xl border border-accent/25 px-3 py-1.5 text-xs text-text outline-none focus:border-primary"
                    />
                  </div>
                )}
                {id === "catatan" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ketik catatan medis/instruksi dokter..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="flex-1 rounded-xl border border-accent/25 px-3 py-1.5 text-xs text-text outline-none focus:border-primary"
                      required
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={adding}
                  className="px-3 py-1.5 rounded-xl bg-primary hover:opacity-90 text-text font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-sm border border-primary/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {adding ? "Menambah..." : "Tambah"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
