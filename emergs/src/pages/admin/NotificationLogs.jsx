/**
 * pages/admin/NotificationLogs.jsx
 *
 * Admin view of all system notification logs.
 * Composes: PageHeader, StatCard, TableToolbar, Table, Badge.
 */

import { useState, useMemo, useEffect } from "react";
import {
  Bell, BellRing, BellOff, Download,
  Info, ClipboardList, AlertTriangle, Users, Zap,
} from "lucide-react";

import PageHeader   from "../../components/common/PageHeader";
import StatCard     from "../../components/common/StatCard";
import TableToolbar from "../../components/common/TableToolbar";
import Table        from "../../components/common/Table";
import Badge        from "../../components/common/Badge";
import Button       from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { getAdminNotifications } from "../../services/api";

const ICON_MAP = { Info, ClipboardList, AlertTriangle, Users, Zap };

const FILTERS = [
  { label: "Semua",    value: "semua"   },
  { label: "Belum Dibaca", value: "unread" },
  { label: "Sudah Dibaca", value: "read"   },
];

const TYPE_LABEL = {
  info:    "Info",
  order:   "Pesanan",
  warning: "Peringatan",
  contact: "Kontak",
  panic:   "Panic",
};

const TYPE_VARIANT = {
  info:    "info",
  order:   "success",
  warning: "warning",
  contact: "purple",
  panic:   "danger",
};

const timeAgo = (dateStr) => {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

const COLUMNS = [
  {
    key:   "index",
    label: "#",
    width: "2rem",
    render: (v) => (
      <span className="text-text/60 text-sm font-mono">
        {String(v).padStart(2, "0")}
      </span>
    ),
  },
  {
    key:   "type",
    label: "Tipe",
    width: "100px",
    render: (v) => (
      <Badge variant={TYPE_VARIANT[v] ?? "neutral"}>
        {TYPE_LABEL[v] ?? v}
      </Badge>
    ),
  },
  {
    key:   "title",
    label: "Judul",
    width: "1fr",
    render: (v, row) => (
      <div>
        <p className="text-text text-sm font-semibold">{v}</p>
        <p className="text-text/60 text-xs mt-1 line-clamp-1">{row.body}</p>
      </div>
    ),
  },
  {
    key:   "time",
    label: "Waktu",
    width: "110px",
    render: (v) => (
      <span className="text-text/60 text-xs">{v}</span>
    ),
  },
  {
    key:   "read",
    label: "Status",
    width: "110px",
    render: (v) => (
      <Badge variant={v ? "neutral" : "success"} dot>
        {v ? "Dibaca" : "Belum Dibaca"}
      </Badge>
    ),
  },
];

export default function NotificationLogs() {
  const [search,       setSearch]  = useState("");
  const [activeFilter, setFilter]  = useState("semua");

  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await getAdminNotifications(authFetch);
        setNotifs(data.map((n, i) => ({
          id: n._id,
          index: i + 1,
          title: n.title || 'Notification',
          body: n.message,
          time: timeAgo(n.timestamp),
          type: n.type,
          read: n.status === 'read'
        })));
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [authFetch]);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const readCount   = notifs.filter((n) => n.read).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notifs.filter((row) => {
      const matchSearch =
        row.title.toLowerCase().includes(q) ||
        row.body.toLowerCase().includes(q);
      const matchFilter =
        activeFilter === "semua"   ? true :
        activeFilter === "unread"  ? !row.read :
        activeFilter === "read"    ? row.read  : true;
      return matchSearch && matchFilter;
    });
  }, [search, activeFilter, notifs]);

  if (loading) {
    return <div className="p-8 text-center text-text/60">Memuat log notifikasi...</div>;
  }

  return (
    <div className="px-4 lg:px-8 py-8">

      {/* ── Page header ── */}
      <PageHeader
        title="Log Notifikasi"
        subtitle="Riwayat seluruh notifikasi sistem yang dikirimkan"
        actions={
          <Button
            variant="secondary"
            iconLeft={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        }
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Notifikasi"
          value={notifs.length}
          icon={<Bell className="w-5 h-5 text-blue-600" />}
          variant="info"
        />
        <StatCard
          label="Belum Dibaca"
          value={unreadCount}
          icon={<BellRing className="w-5 h-5 text-yellow-600" />}
          variant="warning"
        />
        <StatCard
          label="Sudah Dibaca"
          value={readCount}
          icon={<BellOff className="w-5 h-5 text-text" />}
          variant="success"
        />
      </div>

      {/* ── Toolbar ── */}
      <div className="mb-4">
        <TableToolbar
          search={search}
          onSearch={setSearch}
          placeholder="Cari judul atau isi notifikasi..."
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilter={setFilter}
          resultCount={filtered.length}
          totalCount={notifs.length}
        />
      </div>

      {/* ── Table ── */}
      <Table
        columns={COLUMNS}
        data={filtered}
        keyField="id"
        emptyMessage="Tidak ada log notifikasi yang cocok."
      />
    </div>
  );
}
