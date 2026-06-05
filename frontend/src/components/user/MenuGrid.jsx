/**
 * components/user/MenuGrid.jsx
 *
 * 4-column quick-access menu grid shown on the Home page.
 * Reads items from data/menuItems.js and navigates via React Router.
 *
 * Props:
 *  - items: array from MENU_ITEMS (optional override)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Settings, Users, ClipboardList, X
} from "lucide-react";
import { MENU_ITEMS } from "../../data/menuItems";

// Map icon name string → lucide component
const ICON_MAP = {
  Plus,
  Settings,
  Users,
  ClipboardList,
};

export default function MenuGrid({ items = MENU_ITEMS }) {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ id, label, icon, desc, color, hoverColor, navigateTo }) => {
          const Icon = ICON_MAP[icon];

          return (
            <button
              key={id}
              onClick={() => {
                if (id === "efarmasi") {
                  setShowToast(true);
                } else {
                  navigate(navigateTo);
                }
              }}
              className={`
                ${color} ${hoverColor}
                rounded-2xl p-6 flex flex-col items-center gap-3 text-center
                transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/10
                active:scale-95 group cursor-pointer border
              `}
            >
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center group-hover:bg-white/95 transition-all duration-200 shadow-sm">
                {Icon && <Icon className="w-6 h-6 text-text" />}
              </div>
              <div>
                <p className="text-text font-bold text-sm leading-tight">{label}</p>
                <p className="text-text/60 text-xs mt-1.5 leading-snug">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Coming Soon Toast Popup */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-fadeIn">
          <div className="bg-card border border-accent/20 rounded-2xl p-4 shadow-xl flex items-start gap-3 relative transition-colors duration-300">
            <span className="text-xl flex-shrink-0 select-none">🚧</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-text font-bold text-sm leading-tight">Coming Soon</h4>
              <p className="text-text/70 text-xs mt-1 leading-relaxed">
                Fitur E-Farmasi sedang dalam tahap pengembangan. Silakan tunggu update berikutnya.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-text/40 hover:text-text transition-colors p-0.5 rounded-lg cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
