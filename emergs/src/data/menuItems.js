/**
 * data/menuItems.js
 * Four quick-access menu cards displayed on the Home page.
 * `navigateTo` maps to a React Router path.
 */

export const MENU_ITEMS = [
  {
    id:         "efarmasi",
    label:      "E-Farmasi",
    icon:       "Plus",
    desc:       "Layanan farmasi online",
    color:      "bg-primary/35 border border-primary/20",
    hoverColor: "hover:bg-primary/55 hover:shadow-md",
    navigateTo: "/user",          // placeholder — update when E-Farmasi page exists
  },
  {
    id:         "settings",
    label:      "Settings",
    icon:       "Settings",
    desc:       "Pengaturan aplikasi",
    color:      "bg-accent/30 border border-accent/20",
    hoverColor: "hover:bg-accent/50 hover:shadow-md",
    navigateTo: "/user/settings",
  },
  {
    id:         "emergency",
    label:      "Emergency Contacts",
    icon:       "Users",
    desc:       "Kontak darurat Anda",
    color:      "bg-sidebar border border-accent/10",
    hoverColor: "hover:bg-primary/30 hover:shadow-md",
    navigateTo: "/user/contacts",
  },
  {
    id:         "medical",
    label:      "Medical History",
    icon:       "ClipboardList",
    desc:       "Riwayat kesehatan Anda",
    color:      "bg-primary/35 border border-primary/20",
    hoverColor: "hover:bg-primary/55 hover:shadow-md",
    navigateTo: "/user/medical",
  },
];
