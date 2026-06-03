/**
 * pages/admin/MedicalMonitoring.jsx
 *
 * Admin overview of patient medical data.
 * Composes: PageHeader, StatCard, TableToolbar, Table, Badge.
 */

import { useState, useMemo, useEffect } from "react";
import {
  Stethoscope, AlertTriangle, Pill, Activity,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getAdminMedicalRecords } from "../../services/api";

import PageHeader   from "../../components/common/PageHeader";
import StatCard     from "../../components/common/StatCard";
import TableToolbar from "../../components/common/TableToolbar";
import Table        from "../../components/common/Table";
import Badge        from "../../components/common/Badge";

const FILTERS = [
  { label: "Semua",   value: "semua"   },
  { label: "Rendah",  value: "Rendah"  },
  { label: "Sedang",  value: "Sedang"  },
  { label: "Tinggi",  value: "Tinggi"  },
];

const RISK_VARIANT = {
  Rendah: "success",
  Sedang: "warning",
  Tinggi: "danger",
};

const determineRisk = (record) => {
  if (record.disease_history && record.disease_history.length > 5) return "Tinggi";
  if (record.allergies && record.allergies.length > 5) return "Sedang";
  return "Rendah";
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
    key:   "nama",
    label: "Nama Pasien",
    width: "1fr",
    render: (v) => (
      <span className="text-text text-sm font-semibold">{v}</span>
    ),
  },
  {
    key:   "golDarah",
    label: "Gol. Darah",
    width: "80px",
    render: (v) => (
      <span className="text-text text-sm font-mono font-bold">{v || '-'}</span>
    ),
  },
  {
    key:   "alergi",
    label: "Alergi",
    width: "1fr",
    render: (v) => (
      <span className="text-text/80 text-sm">{v || '-'}</span>
    ),
  },
  {
    key:   "kondisi",
    label: "Kondisi",
    width: "1fr",
    render: (v) => (
      <span className="text-text text-sm font-medium">{v || '-'}</span>
    ),
  },
  {
    key:   "risiko",
    label: "Risiko",
    width: "90px",
    render: (v) => (
      <Badge variant={RISK_VARIANT[v] ?? "neutral"} dot>
        {v}
      </Badge>
    ),
  },
];

export default function MedicalMonitoring() {
  const [search,       setSearch]  = useState("");
  const [activeFilter, setFilter]  = useState("semua");
  
  const [medicalData, setMedicalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await getAdminMedicalRecords(authFetch);
        const formatted = records.map((r, i) => ({
          id: r.id,
          index: i + 1,
          nama: r.name,
          golDarah: r.blood_type,
          alergi: r.allergies,
          kondisi: r.disease_history,
          risiko: determineRisk(r)
        }));
        setMedicalData(formatted);
      } catch (err) {
        console.error("Failed to fetch medical records", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [authFetch]);

  const highRisk = medicalData.filter((p) => p.risiko === "Tinggi").length;
  const hasAllergy = medicalData.filter((p) => p.alergi && p.alergi.trim() !== "-" && p.alergi.trim() !== "").length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return medicalData.filter((row) => {
      const matchSearch =
        (row.nama || "").toLowerCase().includes(q) ||
        (row.kondisi || "").toLowerCase().includes(q) ||
        (row.alergi || "").toLowerCase().includes(q);
      const matchFilter =
        activeFilter === "semua" || row.risiko === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [search, activeFilter, medicalData]);

  if (loading) {
    return <div className="p-8 text-center text-text/60">Memuat data medis...</div>;
  }

  return (
    <div className="px-4 lg:px-8 py-8">

      {/* ── Page header ── */}
      <PageHeader
        title="Medical Monitoring"
        subtitle="Pantau kondisi medis seluruh pengguna terdaftar"
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Pasien"
          value={medicalData.length}
          icon={<Stethoscope className="w-5 h-5 text-blue-600" />}
          variant="info"
        />
        <StatCard
          label="Risiko Tinggi"
          value={highRisk}
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          variant="danger"
        />
        <StatCard
          label="Memiliki Alergi"
          value={hasAllergy}
          icon={<Pill className="w-5 h-5 text-yellow-600" />}
          variant="warning"
        />
      </div>

      {/* ── Toolbar ── */}
      <div className="mb-4">
        <TableToolbar
          search={search}
          onSearch={setSearch}
          placeholder="Cari nama, kondisi, atau alergi..."
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilter={setFilter}
          resultCount={filtered.length}
          totalCount={medicalData.length}
        />
      </div>

      {/* ── Table ── */}
      <Table
        columns={COLUMNS}
        data={filtered}
        keyField="id"
        emptyMessage="Tidak ada data pasien yang cocok."
      />
    </div>
  );
}
