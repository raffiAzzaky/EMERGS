import { NavLink } from "react-router-dom";
import { Home, History, User } from "lucide-react";

const NAV_ITEMS = [
  { to: "/user",         label: "Home",    icon: Home    },
  { to: "/user/history", label: "History", icon: History },
  { to: "/user/profile", label: "Profile", icon: User    },
];

export default function BottomNavbar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sidebar border-t border-accent/20 flex items-center justify-around px-4 py-2 safe-area-pb transition-colors duration-300">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/user"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors duration-200 ${
              isActive
                ? "text-text"
                : "text-text/60 hover:text-text"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1.5 rounded-xl transition-colors duration-200 ${
                  isActive ? "bg-primary text-text shadow-sm" : "text-text/60"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold leading-none">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

