/**
 * data/navItems.js
 * Navigation items used by BottomNavbar (user) and Sidebar (admin).
 */

export const USER_NAV_ITEMS = [
  { to: "/user",              label: "Home",    icon: "Home"    },
  { to: "/user/history",      label: "History", icon: "History" },
  { to: "/user/profile",      label: "Profile", icon: "User"    },
];

export const ADMIN_NAV_ITEMS = [
  { to: "/admin",                     label: "Dashboard",          icon: "LayoutDashboard", end: true },
  { to: "/admin/users",               label: "Pengguna",           icon: "Users"            },
  { to: "/admin/panic-monitoring",    label: "Panic Monitoring",   icon: "Zap"              },
  { to: "/admin/medical-monitoring",  label: "Medical Monitoring", icon: "Stethoscope"      },
  { to: "/admin/notification-logs",   label: "Log Notifikasi",     icon: "BellRing"         },
  { to: "/admin/settings",            label: "Pengaturan",         icon: "Settings"         },
];
