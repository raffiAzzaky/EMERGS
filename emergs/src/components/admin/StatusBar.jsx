import { Wifi } from "lucide-react";

const DEFAULT_ITEMS = [
  { icon: Wifi,  label: "GPS Aktif" },
  { pulse: true, label: "Sistem Normal" },
];

export default function StatusBar({ items = DEFAULT_ITEMS }) {
  return (
    <div className="flex items-center gap-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 bg-white border border-accent/20 rounded-full px-4 py-1.5 shadow-sm"
        >
          {item.icon ? (
            <item.icon className="w-3.5 h-3.5 text-accent" />
          ) : item.pulse ? (
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          ) : null}
          <span className="text-text/75 text-xs font-semibold">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
