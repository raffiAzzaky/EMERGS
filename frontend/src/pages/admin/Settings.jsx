/**
 * pages/admin/Settings.jsx
 *
 * Admin system settings page.
 * Composes: PageHeader, SettingRow.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Zap, Accessibility, Info, LogOut,
  Server, Bell, Database, Lock,
} from "lucide-react";

import PageHeader  from "../../components/common/PageHeader";
import SettingRow  from "../../components/user/SettingRow";
import { useAuth } from "../../hooks/useAuth";
import { getAdminSettings, updateAdminSettings } from "../../services/api";

export default function AdminSettings() {
  const [activeId, setActiveId] = useState(null);
  const [settings, setSettings] = useState({
    system_mode: "normal",
    notification_global: true,
    panic_threshold: 5
  });
  const [loading, setLoading] = useState(true);
  const { logout, authFetch }  = useAuth();
  const navigate    = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAdminSettings(authFetch);
        setSettings(data);
      } catch (err) {
        console.error("Gagal memuat pengaturan admin", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [authFetch]);

  const toggle = (id) =>
    setActiveId((prev) => (prev === id ? null : id));

  const handleToggleSetting = async (key) => {
    const val = !settings[key];
    const prev = { ...settings };
    setSettings(s => ({ ...s, [key]: val }));
    try {
      await updateAdminSettings(authFetch, { [key]: val });
    } catch (err) {
      console.error("Gagal memperbarui pengaturan admin", err);
      setSettings(prev);
    }
  };

  const handleSelectSetting = async (key, val) => {
    const prev = { ...settings };
    setSettings(s => ({ ...s, [key]: val }));
    try {
      await updateAdminSettings(authFetch, { [key]: val });
    } catch (err) {
      console.error("Gagal memperbarui pengaturan admin", err);
      setSettings(prev);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="p-8 text-center text-text/60">Memuat pengaturan admin...</div>;
  }

  const ADMIN_SETTINGS_GROUPS = [
    {
      title: "Sistem",
      items: [
        { id: "server",   iconName: "Server",   icon: Server,   label: "Konfigurasi Server",    desc: "Mode Sistem (normal/maintenance)", type: "select", key: "system_mode", options: [{ label: "Normal", value: "normal" }, { label: "Maintenance", value: "maintenance" }] },
        { id: "notif",    iconName: "Bell",     icon: Bell,     label: "Notifikasi Global", desc: "Aktifkan atau nonaktifkan semua notifikasi", type: "toggle", key: "notification_global" },
      ],
    },
    {
      title: "Keamanan",
      items: [
        { id: "security", iconName: "Shield", icon: Shield, label: "Keamanan & Privasi", desc: "JWT, enkripsi, CORS" },
        { id: "access",   iconName: "Lock",   icon: Lock,   label: "Kontrol Akses",      desc: "Role, permission, whitelist IP" },
      ],
    },
    {
      title: "Umum",
      items: [
        { id: "panic-cfg", iconName: "Zap",           icon: Zap,           label: "Konfigurasi Darurat", desc: "Threshold aktivasi panic", type: "select", key: "panic_threshold", options: [{ label: "3 Detik", value: 3 }, { label: "5 Detik", value: 5 }, { label: "10 Detik", value: 10 }] },
        { id: "about",     iconName: "Info",            icon: Info,          label: "Tentang Sistem",      desc: "Versi 2.1.0 • Changelog" },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8 lg:py-10">

      {/* ── Page header ── */}
      <PageHeader
        title="Pengaturan Admin"
        subtitle="Konfigurasi sistem dan platform EMERGs"
      />

      {/* ── Setting groups ── */}
      <div className="space-y-4">
        {ADMIN_SETTINGS_GROUPS.map((group) => (
          <div
            key={group.title}
            className="bg-white border border-accent/20 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Group title */}
            <div className="px-5 py-3 border-b border-accent/15 bg-accent/5">
              <span className="text-text/60 text-xs font-bold uppercase tracking-widest">
                {group.title}
              </span>
            </div>

            {/* Rows */}
            {group.items.map((item, i) => (
              <div key={item.id} className="relative">
                <SettingRow
                  icon={
                    <item.icon
                      className={`w-5 h-5 ${
                        activeId === item.id ? "text-text" : "text-text/70"
                      }`}
                    />
                  }
                  label={item.label}
                  desc={item.desc}
                  isActive={activeId === item.id}
                  onClick={() => toggle(item.id)}
                  isLast={i === group.items.length - 1}
                />
                
                {/* Expanded content */}
                {activeId === item.id && item.type === "toggle" && (
                  <div className="px-14 pb-4 flex items-center justify-between">
                    <span className="text-sm text-text/80">Status</span>
                    <button
                      onClick={() => handleToggleSetting(item.key)}
                      className={`w-10 h-6 rounded-full transition-colors relative ${settings[item.key] ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings[item.key] ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                )}

                {activeId === item.id && item.type === "select" && (
                  <div className="px-14 pb-4">
                    <select
                      value={settings[item.key]}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!isNaN(val)) val = Number(val);
                        handleSelectSetting(item.key, val);
                      }}
                      className="w-full bg-bg border border-accent/20 rounded-xl px-4 py-2 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      {item.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* ── Log Out ── */}
        <div className="bg-white border border-accent/20 rounded-2xl overflow-hidden shadow-sm">
          <SettingRow
            icon={<LogOut className="w-5 h-5 text-danger" />}
            label="Log Out"
            onClick={handleLogout}
            variant="danger"
            isLast
          />
        </div>

        <p className="text-center text-text/50 text-xs pt-2">
          EMERGS Admin Panel v2.1.0 &bull; &copy; 2024 Emergency System
        </p>
      </div>
    </div>
  );
}
