/**
 * data/notifications.js
 * Static seed data for the notifications page.
 * Replace with API call via services/notificationService.js when backend is ready.
 */

export const NOTIFICATIONS_DATA = [
  {
    id:    1,
    title: "Informasi Update",
    body:  "Update EMERG v2.1 tersedia. Perbarui sekarang untuk fitur terbaru.",
    time:  "2 jam lalu",
    type:  "info",
    read:  false,
  },
  {
    id:    2,
    title: "Pesanan akan dikirim",
    body:  "Pesanan E-Farmasi Anda akan segera dikirim ke alamat terdaftar.",
    time:  "5 jam lalu",
    type:  "order",
    read:  false,
  },
  {
    id:    3,
    title: "Maintenance E-Farmasi",
    body:  "Perbaikan Emergs dijadwalkan jam 20.00–21.00. Layanan sementara tidak tersedia.",
    time:  "1 hari lalu",
    type:  "warning",
    read:  true,
  },
  {
    id:    4,
    title: "Kontak Darurat Baru",
    body:  "Ahmad Rizky menambahkan kontak darurat baru: Dr. Hendra.",
    time:  "2 hari lalu",
    type:  "contact",
    read:  true,
  },
  {
    id:    5,
    title: "Panic Button Aktif",
    body:  "Sinyal darurat berhasil dikirim ke 3 kontak pada 15 Juli 2023.",
    time:  "3 hari lalu",
    type:  "panic",
    read:  true,
  },
];

/**
 * Visual metadata per notification type.
 * icon: lucide-react icon name (string) — resolved in the component.
 */
export const NOTIF_META = {
  info:    { iconName: "Info",          bg: "bg-accent/25",      text: "text-text",        dot: "bg-accent"      },
  order:   { iconName: "ClipboardList", bg: "bg-primary/20",     text: "text-text",        dot: "bg-primary"     },
  warning: { iconName: "AlertTriangle", bg: "bg-yellow-500/10",  text: "text-yellow-700",  dot: "bg-yellow-500"  },
  contact: { iconName: "Users",         bg: "bg-purple-500/10",  text: "text-purple-700",  dot: "bg-purple-500"  },
  panic:   { iconName: "Zap",           bg: "bg-danger/10",      text: "text-danger",      dot: "bg-danger"      },
};
