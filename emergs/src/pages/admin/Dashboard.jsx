/**
 * pages/admin/Dashboard.jsx
 *
 * Admin overview dashboard.
 * Composes: PageHeader, StatCard, Table, Badge, StatusBar.
 */

import { useState, useEffect } from "react";
import { Users, Zap, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import StatCard   from "../../components/common/StatCard";
import Table      from "../../components/common/Table";
import Badge      from "../../components/common/Badge";
import StatusBar  from "../../components/admin/StatusBar";
import { useAuth } from "../../hooks/useAuth";
import { getAdminDashboardStats } from "../../services/api";

const mapStatus = (status) => {
  if (status === 'active') return 'Aktif';
  if (status === 'responded') return 'Terrespons';
  if (status === 'resolved') return 'Selesai';
  return status;
};

const COLUMNS = [
  {
    key:   "tanggal",
    label: "Tanggal",
    width: "1fr",
    render: (v) => <span className="text-text text-sm font-semibold">{v}</span>,
  },
  {
    key:   "waktu",
    label: "Waktu",
    width: "90px",
    render: (v) => <span className="text-text/75 text-sm font-mono">{v}</span>,
  },
  {
    key:   "responder",
    label: "Tipe",
    width: "1fr",
    render: (v) => <span className="text-text text-sm font-medium capitalize">{v}</span>,
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats(authFetch);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [authFetch]);

  if (loading) {
    return <div className="p-8 text-center text-text/60">Memuat dashboard...</div>;
  }

  const recentPanicsFormatted = (stats?.recentPanics || []).map(p => {
    const d = new Date(p.timestamp);
    return {
      id: p._id,
      tanggal: d.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
      waktu: d.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
      responder: p.panic_type || '-',
      status: mapStatus(p.status)
    };
  });

  return (
    <div className="px-4 lg:px-8 py-8">

      {/* ── Status bar ── */}
      <div className="mb-8">
        <StatusBar />
      </div>

      {/* ── Page header ── */}
      <PageHeader
        title="Dashboard Admin"
        subtitle="Ringkasan sistem EMERGs secara keseluruhan"
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Pengguna"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          variant="info"
        />
        <StatCard
          label="Total Panic"
          value={stats?.totalPanics || 0}
          icon={<Zap className="w-5 h-5 text-yellow-600" />}
          variant="warning"
        />
        <StatCard
          label="Ditangani (Selesai/Respons)"
          value={stats?.respondedPanics || 0}
          icon={<CheckCircle className="w-5 h-5 text-text" />}
          variant="success"
        />
        <StatCard
          label="Aktif (Belum Ditangani)"
          value={stats?.unhandledPanics || 0}
          icon={<Clock className="w-5 h-5 text-danger" />}
          variant="danger"
        />
      </div>

      {/* ── Two-column section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent panic events — 2/3 width */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-text font-bold text-base">
              Aktivasi Panic Terbaru
            </h2>
            <button
              onClick={() => navigate("/admin/panic-monitoring")}
              className="flex items-center gap-1 text-text hover:text-accent text-xs font-bold transition-colors cursor-pointer"
            >
              Lihat semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <Table
            columns={COLUMNS}
            data={recentPanicsFormatted}
            keyField="id"
            emptyMessage="Belum ada aktivasi panic terbaru."
          />
        </div>

        {/* Quick info — 1/3 width */}
        <div className="space-y-4">
          {/* Contacts summary */}
          <div className="bg-white border border-accent/20 rounded-2xl p-5 shadow-sm">
            <h3 className="text-text font-bold text-sm mb-3">
              Kontak Darurat Terdaftar
            </h3>
            <p className="text-text text-3xl font-bold">
              {stats?.totalContacts || 0}
            </p>
            <p className="text-text/60 text-xs mt-1">
              Dari {stats?.totalUsers || 0} pengguna aktif
            </p>
          </div>

          {/* System status */}
          <div className="bg-white border border-accent/20 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-text font-bold text-sm mb-1">
              Status Sistem
            </h3>
            {[
              { label: "API Server",    ok: true  },
              { label: "GPS Service",   ok: true  },
              { label: "Notifikasi",    ok: true  },
              { label: "Database",      ok: true },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-text/75 text-xs font-medium">{label}</span>
                <Badge variant={ok ? "success" : "danger"} dot size="sm">
                  {ok ? "Online" : "Offline"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
