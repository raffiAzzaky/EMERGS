/**
 * pages/admin/PanicMonitoring.jsx
 *
 * Admin view of all panic button activations across all users.
 * Composes: PageHeader, StatCard, TableToolbar, Table, Badge.
 */

import { useState, useMemo, useEffect } from "react";
import { Zap, CheckCircle, Clock, AlertTriangle, Download, MapPin } from "lucide-react";

import PageHeader   from "../../components/common/PageHeader";
import StatCard     from "../../components/common/StatCard";
import TableToolbar from "../../components/common/TableToolbar";
import Table        from "../../components/common/Table";
import Badge        from "../../components/common/Badge";
import Button       from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { getAdminPanicLogs } from "../../services/api";

const FILTERS = [
  { label: "Semua",       value: "semua"       },
  { label: "Aktif",       value: "Aktif"       },
  { label: "Terrespons",  value: "Terrespons"  },
  { label: "Selesai",     value: "Selesai"     },
];

const mapStatus = (status) => {
  if (status === 'active') return 'Aktif';
  if (status === 'responded') return 'Terrespons';
  if (status === 'resolved') return 'Selesai';
  return status;
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
      <span className="text-text/60 text-xs font-mono">
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

export default function PanicMonitoring() {
  const [search,       setSearch]  = useState("");
  const [activeFilter, setFilter]  = useState("semua");
  const [selectedId,   setSelected] = useState(null);
  
  const [panicLogs, setPanicLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await getAdminPanicLogs(authFetch);
        const formatted = logs.map((p, i) => {
          const d = new Date(p.timestamp);
          return {
            id: p._id,
            index: i + 1,
            tanggal: d.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
            waktu: d.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
            lat: p.location?.latitude?.toFixed(4) || '-',
            lng: p.location?.longitude?.toFixed(4) || '-',
            responder: p.panic_type || '-',
            status: mapStatus(p.status)
          };
        });
        setPanicLogs(formatted);
      } catch (err) {
        console.error("Failed to fetch panic logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [authFetch]);

  const totalResponded = panicLogs.filter(
    (r) => r.status === "Terrespons" || r.status === "Selesai"
  ).length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return panicLogs.filter((row) => {
      const matchSearch =
        row.tanggal.toLowerCase().includes(q) ||
        row.responder.toLowerCase().includes(q);
      const matchFilter =
        activeFilter === "semua" || row.status === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [search, activeFilter, panicLogs]);

  if (loading) {
    return <div className="p-8 text-center text-text/60">Memuat data panic...</div>;
  }

  return (
    <div className="px-4 lg:px-8 py-8">

      {/* ── Page header ── */}
      <PageHeader
        title="Panic Monitoring"
        subtitle="Rekap seluruh aktivasi tombol darurat dari semua pengguna"
        actions={
          <Button
            variant="secondary"
            iconLeft={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        }
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Aktivasi"
          value={panicLogs.length}
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
          value={panicLogs.length - totalResponded}
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
          totalCount={panicLogs.length}
        />
      </div>

      {/* ── Table ── */}
      <Table
        columns={COLUMNS}
        data={filtered}
        keyField="id"
        selectedId={selectedId}
        onRowClick={(row) =>
          setSelected((prev) => (prev === row.id ? null : row.id))
        }
        emptyMessage="Tidak ada data yang cocok."
      />
    </div>
  );
}
