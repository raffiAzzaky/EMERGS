import { NavLink } from "react-router-dom";
import {
  Home,
  History,
  User,
  ClipboardList,
  Users,
  BellRing,
  Settings,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const USER_NAV_ITEMS = [
  { to: "/user",             label: "Dashboard",          icon: Home, end: true },
  { to: "/user/history",     label: "Riwayat Panic",      icon: History },
  { to: "/user/medical",     label: "Riwayat Medis",      icon: ClipboardList },
  { to: "/user/contacts",    label: "Kontak Darurat",     icon: Users },
  { to: "/user/notifications",label: "Notifikasi",        icon: BellRing },
  { to: "/user/settings",    label: "Pengaturan",         icon: Settings },
  { to: "/user/profile",     label: "Profil Saya",        icon: User },
];

export default function UserSidebar({ isCollapsed, setIsCollapsed }) {
  const { user } = useAuth();

  return (
    <aside
      className={`
        hidden md:flex flex-col h-screen sticky top-0 bg-sidebar border-r border-accent/20 text-text transition-all duration-300 ease-in-out z-30 flex-shrink-0
        ${isCollapsed ? "w-20" : "w-60"}
        lg:w-60
      `}
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-accent/20 relative">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
          <MapPin className="w-5 h-5 text-text" />
        </div>
        <div className={`transition-all duration-300 ${isCollapsed ? "md:hidden lg:block" : "block"}`}>
          <p className="text-text font-bold text-base leading-none tracking-tight">MedAlert</p>
          <p className="text-text/60 text-[10px] mt-0.5 font-medium uppercase tracking-wider">User Panel</p>
        </div>

        {/* Collapsible toggle button: visible only on tablet (md:flex lg:hidden) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex lg:hidden absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-sidebar border border-accent/30 items-center justify-center text-text hover:bg-primary transition-all shadow-md z-40 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto flex flex-col justify-center">
        {USER_NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative ${
                isCollapsed ? "md:justify-center lg:justify-start" : ""
              } ${
                isActive
                  ? "bg-primary text-text shadow-sm font-semibold"
                  : "text-text/70 hover:bg-accent/20 hover:text-text"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? "text-text" : "text-text/60 group-hover:text-text"
                  }`}
                />
                <span
                  className={`truncate transition-all duration-300 ${
                    isCollapsed ? "md:hidden lg:block" : "block"
                  }`}
                >
                  {label}
                </span>
                
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-text rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      {user && (
        <div className="px-4 py-4 border-t border-accent/20 bg-accent/5">
          <div
            className={`flex items-center gap-3 p-2.5 rounded-2xl bg-sidebar/50 border border-accent/10 ${
              isCollapsed ? "md:justify-center lg:justify-start" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-text text-sm font-bold flex-shrink-0 shadow-sm">
              {user.initials ?? user.name?.slice(0, 2).toUpperCase()}
            </div>
            <div
              className={`min-w-0 transition-all duration-300 ${
                isCollapsed ? "md:hidden lg:block" : "block"
              }`}
            >
              <p className="text-text text-sm font-semibold truncate leading-tight">{user.name}</p>
              <p className="text-text/60 text-xs truncate mt-0.5">Pasien</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
