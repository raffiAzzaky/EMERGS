/**
 * pages/user/History.jsx
 *
 * Displays the user's panic button event history.
 * Composes: PageHeader, StatCard, TableToolbar, Table, Badge.
 */

import { useState, useMemo, useEffect } from "react";
import { MapPin, Download, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getPanicHistory } from "../../services/api";

import PageHeader    from "../../components/common/PageHeader";
import StatCard      from "../../components/common/StatCard";
import TableToolbar  from "../../components/common/TableToolbar";
import Table         from "../../components/common/Table";
import Badge         from "../../components/common/Badge";

// ── Filter options ──────────────────────────────────────────
const FILTERS = [
  { label: "Semua",       value: "semua"       },
  { label: "Aktif",       value: "Aktif"       },
  { label: "Terrespons",  value: "Terrespons"  },
  { label: "Selesai",     value: "Selesai"     },
];

// ── Table column definitions ────────────────────────────────
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
    key:   "tanggal",
    label: "Tanggal",
    width: "1fr",
    render: (v) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        <span className="text-text text-sm font-semibold">{v}</span>
      </div>
    ),
  },
  {
    key:   "waktu",
    label: "Waktu",
    width: "90px",
    render: (v) => (
      <span className="text-text/75 text-sm font-mono">{v}</span>
    ),
  },
  {
    key:   "lat",
    label: "Koordinat",
    width: "1fr",
    render: (_, row) => (
      <span className="text-text/60 text-xs font-mono leading-relaxed">
        {row.lat}, {row.lng}
      </span>
    ),
  },
  {
    key:   "responder",
    label: "Tipe",
    width: "1fr",
    render: (v) => (
      <span className="text-text text-sm font-medium capitalize">{v}</span>
    ),
  },
  {
    key:   "status",
    label: "Status",
    width: "110px",
    render: (v) => {
      let variant = "warning";
      if (v === "Terrespons") variant = "primary";
      if (v === "Selesai") variant = "success";
      if (v === "Aktif") variant = "danger";
      return (
        <Badge variant={variant} dot>
          {v}
        </Badge>
      );
    },
  },
];

const mapStatus = (status) => {
  if (status === 'active') return 'Aktif';
  if (status === 'responded') return 'Terrespons';
  if (status === 'resolved') return 'Selesai';
  return status;
};

export default function History() {
  const [search,      setSearch]      = useState("");
  const [activeFilter, setFilter]     = useState("semua");
  const [selectedId,  setSelectedId]  = useState(null);
  
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const logs = await getPanicHistory(authFetch);
        const formatted = logs.map((log, i) => {
          const d = new Date(log.timestamp);
          return {
            id: log._id,
            index: i + 1,
            tanggal: d.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
            waktu: d.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
            lat: log.location?.latitude?.toFixed(4) || '-',
            lng: log.location?.longitude?.toFixed(4) || '-',
            responder: log.panic_type || '-',
            status: mapStatus(log.status)
          };
        });
        setHistoryData(formatted);
      } catch (error) {
        console.error("Failed to fetch panic history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [authFetch]);

  // ── Derived stats ──────────────────────────────────────────
  const totalResponded = historyData.filter((r) => r.status === "Terrespons" || r.status === "Selesai").length;

  // ── Filtered rows ──────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return historyData.filter((row) => {
      const matchSearch =
        row.tanggal.toLowerCase().includes(q) ||
        row.responder.toLowerCase().includes(q);
      const matchFilter =
        activeFilter === "semua" || row.status === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [search, activeFilter, historyData]);

  if (loading) {
    return <div className="p-8 text-center text-text/60">Memuat riwayat...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">

      {/* ── Page header ── */}
      <PageHeader
        title="Riwayat Panic"
        subtitle="Rekam jejak aktivasi tombol darurat Anda"
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Panic"
          value={historyData.length}
          icon={<AlertTriangle className="w-5 h-5 text-yellow-600" />}
          variant="warning"
        />
        <StatCard
          label="Ditangani (Selesai/Respons)"
          value={totalResponded}
          icon={<CheckCircle className="w-5 h-5 text-text" />}
          variant="success"
        />
        <StatCard
          label="Aktif (Belum Ditangani)"
          value={historyData.length - totalResponded}
          icon={<Clock className="w-5 h-5 text-danger" />}
          variant="danger"
        />
      </div>

      {/* ── Toolbar ── */}
      <div className="mb-4">
        <TableToolbar
          search={search}
          onSearch={setSearch}
          placeholder="Cari tanggal atau tipe darurat..."
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilter={setFilter}
          resultCount={filtered.length}
          totalCount={historyData.length}
        />
      </div>

      {/* ── Data table ── */}
      <Table
        columns={COLUMNS}
        data={filtered}
        keyField="id"
        selectedId={selectedId}
        onRowClick={(row) =>
          setSelectedId((prev) => (prev === row.id ? null : row.id))
        }
        emptyMessage="Tidak ada data riwayat panic."
      />
    </div>
  );
}
