/**
 * components/user/MenuGrid.jsx
 *
 * 4-column quick-access menu grid shown on the Home page.
 * Reads items from data/menuItems.js and navigates via React Router.
 *
 * Props:
 *  - items: array from MENU_ITEMS (optional override)
 */

import { useNavigate } from "react-router-dom";
import {
  Plus, Settings, Users, ClipboardList,
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(({ id, label, icon, desc, color, hoverColor, navigateTo }) => {
        const Icon = ICON_MAP[icon];

        return (
          <button
            key={id}
            onClick={() => navigate(navigateTo)}
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
  );
}
