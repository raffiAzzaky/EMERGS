import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings as SettingsIcon, Bell, Palette, Key, Shield, MapPin } from "lucide-react";

import PageHeader  from "../../components/common/PageHeader";
import SettingRow  from "../../components/user/SettingRow";
import { useAuth } from "../../hooks/useAuth";
import { getUserSettings, updateUserSettings, getPanicHistory, getContacts } from "../../services/api";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

export default function Settings() {
  const { logout, authFetch } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastLoc, setLastLoc] = useState("Tidak ada data");
  const [contactCount, setContactCount] = useState(0);

  // Password change state
  const [pwdForm, setPwdForm] = useState({ oldPassword: "", newPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(null);
  const [pwdError, setPwdError] = useState(null);

  const fetchSettings = async () => {
    try {
      const data = await getUserSettings(authFetch);
      setSettings(data);

      const logs = await getPanicHistory(authFetch);
      if (logs && logs.length > 0) {
        const lastLog = logs[0];
        if (lastLog.location?.latitude && lastLog.location?.longitude) {
          setLastLoc(`Lat: ${lastLog.location.latitude.toFixed(4)}, Lng: ${lastLog.location.longitude.toFixed(4)}`);
        }
      }

      const contactsList = await getContacts(authFetch);
      setContactCount(contactsList.length);
    } catch (error) {
      console.error("Failed to load settings data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [authFetch]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSetting = async (key) => {
    if (!settings) return;
    if (key === 'theme') return; // theme is disabled

    let newValue = !settings[key];
    
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwdForm.oldPassword || !pwdForm.newPassword) {
      setPwdError("Harap isi semua kolom");
      return;
    }
    setPwdLoading(true);
    setPwdError(null);
    setPwdSuccess(null);

    try {
      await authFetch("/users/change-password", {
        method: "PUT",
        body: JSON.stringify(pwdForm)
      });
      setPwdSuccess("Password berhasil diubah!");
      setPwdForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setPwdError(err.message || "Gagal mengubah password.");
    } finally {
      setPwdLoading(false);
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

      <div className="space-y-6">
        {/* ── Preferensi ── */}
        <div className="bg-white border border-accent/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-accent/15 bg-accent/5">
            <span className="text-text/60 text-xs font-bold uppercase tracking-widest">
              Preferensi Pengguna
            </span>
          </div>

          <div className="relative">
            <SettingRow
              icon={<Palette className="w-5 h-5 text-text/40" />}
              label="Tema Gelap"
              desc="Ganti ke mode gelap"
              isActive={false}
              onClick={() => {}}
              isLast={false}
            />
            {/* Coming Soon Overlay / Badge */}
            <span className="absolute right-4 top-4 bg-primary/20 text-text text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
              Coming Soon
            </span>
          </div>

          <SettingRow
            icon={<Bell className="w-5 h-5 text-text/70" />}
            label="Notifikasi Email"
            desc="Terima pemberitahuan via email"
            isActive={!!settings?.email_notifications}
            onClick={() => toggleSetting('email_notifications')}
            isLast={true}
          />
        </div>

        {/* ── Informasi Akun ── */}
        <div className="bg-white border border-accent/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-accent/15 bg-accent/5">
            <span className="text-text/60 text-xs font-bold uppercase tracking-widest">
              Informasi Akun
            </span>
          </div>

          <div className="px-5 py-4 border-b border-accent/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-text/70 flex-shrink-0" />
              <div>
                <p className="text-text text-sm font-bold">Lokasi Terakhir</p>
                <p className="text-text/60 text-xs mt-0.5">Sinyal darurat aktif terakhir Anda</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-text bg-accent/10 px-3 py-1 rounded-xl">
              {lastLoc}
            </span>
          </div>

          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-text/70 flex-shrink-0" />
              <div>
                <p className="text-text text-sm font-bold">Kontak Darurat</p>
                <p className="text-text/60 text-xs mt-0.5">Jumlah kontak terdaftar</p>
              </div>
            </div>
            <span className="text-xs font-bold text-text bg-accent/10 px-3 py-1 rounded-xl">
              {contactCount} Kontak
            </span>
          </div>
        </div>

        {/* ── Ganti Password ── */}
        <div className="bg-white border border-accent/20 rounded-2xl overflow-hidden shadow-sm p-5">
          <h3 className="text-text font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Key className="w-4 h-4 text-text" /> Ganti Password
          </h3>
          
          {pwdSuccess && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 text-xs font-bold text-green-700">
              {pwdSuccess}
            </div>
          )}
          {pwdError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-bold text-red-700">
              {pwdError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <InputField
              theme="light"
              label="Password Lama"
              type="password"
              required
              value={pwdForm.oldPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
              placeholder="••••••••"
            />
            <InputField
              theme="light"
              label="Password Baru"
              type="password"
              required
              value={pwdForm.newPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
              placeholder="••••••••"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={pwdLoading}
              className="w-full sm:w-auto py-2.5 text-xs"
            >
              {pwdLoading ? "Mengubah..." : "Ubah Password"}
            </Button>
          </form>
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
          EMERGs v2.1.0 &bull; &copy; 2026 Emergency Health System
        </p>
      </div>
    </div>
  );
}
