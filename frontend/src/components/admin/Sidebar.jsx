import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Zap, Stethoscope,
  BellRing, Settings, MapPin, X, ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin",                    label: "Dashboard",          icon: LayoutDashboard, end: true },
  { to: "/admin/users",              label: "Pengguna",           icon: Users },
  { to: "/admin/panic-monitoring",   label: "Panic Monitoring",   icon: Zap },
  { to: "/admin/medical-monitoring", label: "Medical Monitoring", icon: Stethoscope },
  { to: "/admin/notification-logs",  label: "Log Notifikasi",     icon: BellRing },
  { to: "/admin/settings",           label: "Pengaturan",         icon: Settings },
];

export default function Sidebar({ isOpen, onClose, user }) {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-30 w-64 bg-sidebar border-r border-accent/20
        flex flex-col transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-accent/20">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
          <MapPin className="w-5 h-5 text-text" />
        </div>
        <div>
          <p className="text-text font-bold text-base leading-none tracking-tight">MedAlert</p>
          <p className="text-text/60 text-xs mt-0.5 font-medium uppercase tracking-wider">Admin Panel</p>
        </div>
        <button
          className="ml-auto lg:hidden text-text/60 hover:text-text transition-colors"
          onClick={onClose}
          aria-label="Tutup sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto flex flex-col justify-center">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary text-text shadow-sm font-semibold"
                  : "text-text/70 hover:bg-accent/20 hover:text-text"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${isActive ? "text-text" : "text-text/60 group-hover:text-text"}`} />
                <span className="flex-1 truncate">{label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-text/60" />}
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-text rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      {user && (
        <div className="px-4 py-4 border-t border-accent/20 bg-accent/5">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-sidebar/50 border border-accent/10">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-text text-sm font-bold flex-shrink-0 shadow-sm">
              {user.initials ?? user.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-text text-sm font-semibold truncate leading-tight">{user.name}</p>
              <p className="text-text/60 text-xs truncate mt-0.5">{user.status ?? "Administrator"}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
