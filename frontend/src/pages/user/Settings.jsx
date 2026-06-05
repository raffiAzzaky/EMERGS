import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Palette, Key, Shield, MapPin, Bell } from "lucide-react";

import PageHeader  from "../../components/common/PageHeader";
import SettingRow  from "../../components/user/SettingRow";
import { useAuth } from "../../hooks/useAuth";
import { getUserSettings, updateUserSettings, getPanicHistory, getContacts } from "../../services/api";
import InputField from "../../components/common/InputField";
import Modal from "../../components/common/Modal";

export default function Settings() {
  const { logout, authFetch } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastLoc, setLastLoc] = useState("Tidak ada data");
  const [contactCount, setContactCount] = useState(0);

  // Password change state
  const [pwdForm, setPwdForm] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(null);
  const [pwdError, setPwdError] = useState(null);

  // Modals visibility states
  const [activeModal, setActiveModal] = useState(null); // 'theme' | 'email' | 'password' | null
  const [currentTheme, setCurrentTheme] = useState(() => {
    let theme = localStorage.getItem("theme");
    if (!theme) {
      theme = "light";
      localStorage.setItem("theme", "light");
    }
    return theme;
  });

  const fetchSettings = async () => {
    try {
      const data = await getUserSettings(authFetch);
      setSettings(data);

      // Sync active theme class and local storage
      let themeVal = data?.theme || localStorage.getItem("theme");
      if (!themeVal) {
        themeVal = "light";
      }
      setCurrentTheme(themeVal);
      if (themeVal === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", themeVal);

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

  const handleThemeChange = async (themeName) => {
    setCurrentTheme(themeName);
    if (themeName === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    try {
      await updateUserSettings(authFetch, { theme: themeName });
      setSettings((prev) => (prev ? { ...prev, theme: themeName } : prev));
    } catch (error) {
      console.error("Failed to save theme setting to database:", error);
    }
  };

  const handleToggleEmail = async () => {
    if (!settings) return;
    const newValue = !settings.email_notifications;
    const prev = { ...settings };
    setSettings({ ...settings, email_notifications: newValue });
    try {
      await updateUserSettings(authFetch, { email_notifications: newValue });
    } catch (error) {
      console.error("Failed to update email notification:", error);
      setSettings(prev);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwdForm.oldPassword || !pwdForm.newPassword || !pwdForm.confirmNewPassword) {
      setPwdError("Harap isi semua kolom");
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmNewPassword) {
      setPwdError("Konfirmasi password baru tidak cocok");
      return;
    }
    setPwdLoading(true);
    setPwdError(null);
    setPwdSuccess(null);

    try {
      await authFetch("/users/change-password", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword: pwdForm.oldPassword,
          newPassword: pwdForm.newPassword,
        }),
      });
      setPwdSuccess("Password berhasil diubah!");
      setPwdForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      setTimeout(() => {
        setActiveModal(null);
        setPwdSuccess(null);
      }, 1500);
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
        <div className="bg-card border border-accent/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-accent/15 bg-accent/5">
            <span className="text-text/60 text-xs font-bold uppercase tracking-widest">
              Preferensi Pengguna
            </span>
          </div>

          <SettingRow
            icon={<Palette className="w-5 h-5 text-text/70" />}
            label="Tema Gelap"
            desc="Ganti ke mode gelap"
            onClick={() => setActiveModal("theme")}
            isLast={false}
          />

          <SettingRow
            icon={<Bell className="w-5 h-5 text-text/70" />}
            label="Notifikasi Email"
            desc="Terima pemberitahuan via email"
            onClick={() => setActiveModal("email")}
            isLast={false}
          />

          <SettingRow
            icon={<Key className="w-5 h-5 text-text/70" />}
            label="Ganti Password"
            desc="Ubah sandi keamanan akun Anda"
            onClick={() => setActiveModal("password")}
            isLast={true}
          />
        </div>

        {/* ── Informasi Akun ── */}
        <div className="bg-card border border-accent/20 rounded-2xl overflow-hidden shadow-sm">
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

        {/* ── Log Out ── */}
        <div className="bg-card border border-accent/20 rounded-2xl overflow-hidden shadow-sm">
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

      {/* ── Theme Modal ── */}
      <Modal
        isOpen={activeModal === "theme"}
        onClose={() => setActiveModal(null)}
        title="Pengaturan Tema"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text/70 text-xs leading-relaxed">
            Pilih preferensi tampilan untuk panel aplikasi Anda.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleThemeChange("light")}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${
                currentTheme === "light"
                  ? "border-primary bg-primary/10 shadow-sm font-bold"
                  : "border-accent/20 bg-card hover:bg-accent/5"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#ECF4E8] border border-accent/25 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#ABE7B2]" />
              </div>
              <span className="text-sm text-text">Light Mode</span>
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${
                currentTheme === "dark"
                  ? "border-primary bg-primary/10 shadow-sm font-bold"
                  : "border-accent/20 bg-card hover:bg-accent/5"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#111827] border border-accent/25 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#10B981]" />
              </div>
              <span className="text-sm text-text">Dark Mode</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Email Notifications Modal ── */}
      <Modal
        isOpen={activeModal === "email"}
        onClose={() => setActiveModal(null)}
        title="Notifikasi Email"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text/70 text-xs leading-relaxed">
            Aktifkan untuk menerima pemberitahuan penting dan laporan langsung melalui alamat email Anda.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleToggleEmail()}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-accent/20 bg-card hover:bg-accent/5 transition-all text-left cursor-pointer"
            >
              <div>
                <p className="text-text text-sm font-bold">Terima email notifikasi</p>
                <p className="text-text/60 text-xs mt-0.5">Notifikasi darurat dan log laporan</p>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors duration-200 p-0.5 ${
                  settings?.email_notifications ? "bg-primary" : "bg-accent/30"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    settings?.email_notifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Change Password Modal ── */}
      <Modal
        isOpen={activeModal === "password"}
        onClose={() => {
          setActiveModal(null);
          setPwdError(null);
          setPwdSuccess(null);
          setPwdForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
        }}
        title="Ganti Password"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text/70 text-xs leading-relaxed">
            Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun Anda.
          </p>

          {pwdSuccess && (
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 text-xs font-bold text-green-700">
              {pwdSuccess}
            </div>
          )}
          {pwdError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-bold text-red-700">
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
            <InputField
              theme="light"
              label="Konfirmasi Password Baru"
              type="password"
              required
              value={pwdForm.confirmNewPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, confirmNewPassword: e.target.value })}
              placeholder="••••••••"
            />
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setPwdError(null);
                  setPwdSuccess(null);
                  setPwdForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
                }}
                className="flex-1 py-2.5 rounded-xl border border-accent/40 text-text text-sm font-semibold hover:bg-accent/10 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={pwdLoading}
                className="flex-1 py-2.5 rounded-xl bg-primary text-text text-sm font-semibold hover:opacity-90 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {pwdLoading ? "Mengubah..." : "Ubah Password"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
