/**
 * components/user/InfoStrip.jsx
 *
 * 3-column summary strip shown at the bottom of the Home page.
 *
 * Props:
 *  - items: Array<{ label, value, sub }>
 *           defaults to the three standard home items
 */

import { ChevronRight } from "lucide-react";

const DEFAULT_ITEMS = [
  { label: "Lokasi Terakhir", value: "Surabaya, Jawa Timur", sub: "Diperbarui 2 menit lalu" },
  { label: "Kontak Darurat",  value: "3 Kontak",             sub: "Siap dihubungi"          },
  { label: "Obat Tersedia",   value: "12 Item",              sub: "Di E-Farmasi"             },
];

export default function InfoStrip({ items = DEFAULT_ITEMS }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card border border-accent/20 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <div>
            <p className="text-text/60 text-xs font-bold uppercase tracking-wider mb-1">
              {item.label}
            </p>
            <p className="text-text font-bold text-sm">{item.value}</p>
            <p className="text-text/50 text-xs mt-1">{item.sub}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-accent flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
