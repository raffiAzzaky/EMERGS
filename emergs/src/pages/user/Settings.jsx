import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings as SettingsIcon, Bell, Palette } from "lucide-react";

import PageHeader  from "../../components/common/PageHeader";
import SettingRow  from "../../components/user/SettingRow";
import { useAuth } from "../../hooks/useAuth";
import { getUserSettings, updateUserSettings } from "../../services/api";

export default function Settings() {
  const { logout, authFetch } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getUserSettings(authFetch);
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [authFetch]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSetting = async (key) => {
    if (!settings) return;
    let newValue;
    if (key === 'theme') {
      newValue = settings.theme === 'light' ? 'dark' : 'light';
    } else {
      newValue = !settings[key];
    }
    
    // Optimistic update
    const prev = { ...settings };
    setSettings({ ...settings, [key]: newValue });

    try {
      await updateUserSettings(authFetch, { [key]: newValue });
    } catch (error) {
      console.error("Failed to update setting:", error);
      setSettings(prev); // revert
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text/60">Memuat pengaturan...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8 lg:py-10">
      {/* ── Page header ── */}
      <PageHeader
        title="Settings"
        subtitle="Kelola preferensi dan konfigurasi aplikasi"
      />

      <div className="space-y-4">
        <div className="bg-white border border-accent/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-accent/15 bg-accent/5">
            <span className="text-text/60 text-xs font-bold uppercase tracking-widest">
              Preferensi Pengguna
            </span>
          </div>

          <SettingRow
            icon={<Palette className="w-5 h-5 text-text/70" />}
            label="Tema Gelap"
            desc="Ganti ke mode gelap"
            isActive={settings?.theme === 'dark'}
            onClick={() => toggleSetting('theme')}
            isLast={false}
          />
          <SettingRow
            icon={<Bell className="w-5 h-5 text-text/70" />}
            label="Notifikasi Email"
            desc="Terima pemberitahuan via email"
            isActive={!!settings?.email_notifications}
            onClick={() => toggleSetting('email_notifications')}
            isLast={false}
          />
          <SettingRow
            icon={<SettingsIcon className="w-5 h-5 text-text/70" />}
            label="Push Notifikasi"
            desc="Notifikasi instan di perangkat"
            isActive={!!settings?.push_notifications}
            onClick={() => toggleSetting('push_notifications')}
            isLast={true}
          />
        </div>

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
          MedAlert v2.1.0 &bull; &copy; 2024 Emergency System
        </p>
      </div>
    </div>
  );
}
