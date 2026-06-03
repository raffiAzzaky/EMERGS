/**
 * pages/admin/Users.jsx
 *
 * Admin page for managing registered users.
 * Composes: PageHeader, StatCard, TableToolbar, Table, Badge, Button.
 */

import { useState, useMemo, useEffect } from "react";
import {
  Users as UsersIcon, UserCheck, UserX, UserPlus, Eye, Trash2,
} from "lucide-react";

import PageHeader   from "../../components/common/PageHeader";
import StatCard     from "../../components/common/StatCard";
import TableToolbar from "../../components/common/TableToolbar";
import Table        from "../../components/common/Table";
import Badge        from "../../components/common/Badge";
import Button       from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { getAdminUsers, deleteAdminUser } from "../../services/api";

const FILTERS = [
  { label: "Semua",        value: "semua"        },
  { label: "Aktif",        value: "Aktif"        },
  { label: "Tidak Aktif",  value: "Tidak Aktif"  },
  { label: "Admin",        value: "admin"        },
];

export default function Users() {
  const [search,      setSearch]  = useState("");
  const [activeFilter, setFilter] = useState("semua");
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers(authFetch);
      const formatted = data.map((u, i) => ({
        id: u.id,
        index: i + 1,
        nama: u.name,
        email: u.email,
        role: u.role,
        status: "Aktif", // We can determine status based on last_login or similar, assume Aktif for now
        joined: new Date(u.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
      }));
      setUsers(formatted);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [authFetch]);

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna ${nama}?`)) {
      try {
        await deleteAdminUser(authFetch, id);
        alert('Pengguna berhasil dihapus.');
        fetchUsers();
      } catch (err) {
        console.error("Gagal menghapus pengguna", err);
        alert('Gagal menghapus pengguna.');
      }
    }
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
      label: "Nama",
      width: "1fr",
      render: (v, row) => (
        <div>
          <p className="text-text text-sm font-semibold">{v}</p>
          <p className="text-text/60 text-xs">{row.email}</p>
        </div>
      ),
    },
    {
      key:   "role",
      label: "Role",
      width: "80px",
      render: (v) => (
        <Badge variant={v === "admin" ? "warning" : "neutral"}>
          {v}
        </Badge>
      ),
    },
    {
      key:   "status",
      label: "Status",
      width: "110px",
      render: (v) => (
        <Badge variant={v === "Aktif" ? "success" : "danger"} dot>
          {v}
        </Badge>
      ),
    },
    {
      key:   "joined",
      label: "Bergabung",
      width: "110px",
      render: (v) => (
        <span className="text-text/60 text-xs">{v}</span>
      ),
    },
    {
      key:   "id",
      label: "Aksi",
      width: "90px",
      render: (id, row) => (
        <div className="flex items-center gap-1">
          <button
            className="w-7 h-7 rounded-lg bg-accent/15 hover:bg-accent/25 flex items-center justify-center transition-colors cursor-pointer"
            title="Lihat detail"
          >
            <Eye className="w-3.5 h-3.5 text-text" />
          </button>
          <button
            onClick={() => handleDelete(id, row.nama)}
            className="w-7 h-7 rounded-lg bg-danger/10 hover:bg-danger/20 flex items-center justify-center transition-colors cursor-pointer"
            title="Hapus pengguna"
          >
            <Trash2 className="w-3.5 h-3.5 text-danger" />
          </button>
        </div>
      ),
    },
  ];

  const activeCount   = users.filter((u) => u.status === "Aktif").length;
  const inactiveCount = users.filter((u) => u.status === "Tidak Aktif").length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        u.nama.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchFilter =
        activeFilter === "semua" ||
        u.status === activeFilter ||
        u.role   === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [search, activeFilter, users]);

  if (loading) {
    return <div className="p-8 text-center text-text/60">Memuat data pengguna...</div>;
  }

  return (
    <div className="px-4 lg:px-8 py-8">

      {/* ── Page header ── */}
      <PageHeader
        title="Manajemen Pengguna"
        subtitle="Daftar seluruh pengguna terdaftar di sistem"
        actions={
          <Button
            variant="primary"
            iconLeft={<UserPlus className="w-4 h-4" />}
          >
            Tambah Pengguna
          </Button>
        }
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Pengguna"
          value={users.length}
          icon={<UsersIcon className="w-5 h-5 text-blue-600" />}
          variant="info"
        />
        <StatCard
          label="Pengguna Aktif"
          value={activeCount}
          icon={<UserCheck className="w-5 h-5 text-text" />}
          variant="success"
        />
        <StatCard
          label="Tidak Aktif"
          value={inactiveCount}
          icon={<UserX className="w-5 h-5 text-danger" />}
          variant="danger"
        />
      </div>

      {/* ── Toolbar ── */}
      <div className="mb-4">
        <TableToolbar
          search={search}
          onSearch={setSearch}
          placeholder="Cari nama atau email..."
          filters={FILTERS}
          activeFilter={activeFilter}
          onFilter={setFilter}
          resultCount={filtered.length}
          totalCount={users.length}
        />
      </div>

      {/* ── Table ── */}
      <Table
        columns={COLUMNS}
        data={filtered}
        keyField="id"
        emptyMessage="Tidak ada pengguna yang cocok dengan pencarian."
      />
    </div>
  );
}
