/**
 * pages/user/Home.jsx
 *
 * Main dashboard page for the user.
 * Composes: StatusBar, PanicButton, SectionDivider, MenuGrid, InfoStrip.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { triggerPanic, getPanicHistory, getContacts } from "../../services/api";
import { AlertTriangle } from "lucide-react";

import PanicButton    from "../../components/user/PanicButton";
import MenuGrid       from "../../components/user/MenuGrid";
import InfoStrip      from "../../components/user/InfoStrip";
import SectionDivider from "../../components/common/SectionDivider";
import StatusBar      from "../../components/admin/StatusBar";

export default function Home() {
  const [panicActive, setPanicActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const { authFetch } = useAuth();
  
  const [infoItems, setInfoItems] = useState([
    { label: "Lokasi Terakhir", value: "Loading...", sub: "Memuat lokasi..." },
    { label: "Kontak Darurat",  value: "Loading...", sub: "Memuat kontak..." },
    { label: "Obat Tersedia",   value: "Loading...", sub: "Memuat data obat..." },
  ]);

  const loadInfo = async () => {
    try {
      // 1. Get panic logs
      const logs = await getPanicHistory(authFetch);
      let lastLocValue = "Tidak ada data";
      let lastLocSub = "Sinyal belum dikirim";
      if (logs && logs.length > 0) {
        const lastLog = logs[0];
        if (lastLog.location?.latitude && lastLog.location?.longitude) {
          lastLocValue = `${lastLog.location.latitude.toFixed(4)}, ${lastLog.location.longitude.toFixed(4)}`;
          const d = new Date(lastLog.timestamp);
          lastLocSub = `Diperbarui ${d.toLocaleDateString("id-ID")} ${d.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}`;
        }
      }

      // 2. Get contacts count
      const contactsList = await getContacts(authFetch);
      const contactVal = `${contactsList.length} Kontak`;

      // 3. Get medications count
      const medRes = await authFetch("/medical/medications");
      const medCount = medRes.medications ? medRes.medications.length : 0;
      const medVal = `${medCount} Obat`;

      setInfoItems([
        { label: "Lokasi Terakhir", value: lastLocValue, sub: lastLocSub },
        { label: "Kontak Darurat",  value: contactVal, sub: "Siap dihubungi" },
        { label: "Obat Tersedia",   value: medVal, sub: "Terdaftar aktif" },
      ]);
    } catch (err) {
      console.error("Failed to load info strip items:", err);
    }
  };

  useEffect(() => {
    loadInfo();
  }, [authFetch]);

  const handlePanicClick = () => {
    if (panicActive) return;
    setShowConfirm(true);
  };

  const triggerPanicAlert = async () => {
    setShowConfirm(false);
    setPanicActive(true);
    setSuccessMsg(false);

    try {
      let location = { latitude: 0, longitude: 0 };
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, enableHighAccuracy: true });
          });
          location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        } catch (err) {
          console.warn("Could not retrieve precise location:", err);
        }
      }

      await triggerPanic(authFetch, {
        location,
        panic_type: "emergency"
      });

      setSuccessMsg(true);
      // Reload stats
      await loadInfo();
    } catch (error) {
      console.error("Failed to trigger panic:", error);
      alert("Gagal mengirim sinyal darurat! " + error.message);
    } finally {
      setTimeout(() => {
        setPanicActive(false);
        setSuccessMsg(false);
      }, 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      {/* ── Status bar ── */}
      <div className="mb-10">
        <StatusBar />
      </div>

      {/* ── Panic Button ── */}
      <PanicButton onPress={handlePanicClick} active={panicActive} />
      
      {successMsg && (
        <div className="mt-4 max-w-sm mx-auto text-center p-3 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold animate-pulse">
          ✓ Sinyal darurat berhasil tercatat & kontak diberitahukan!
        </div>
      )}

      {/* ── Menu Grid ── */}
      <SectionDivider label="Menu Utama" />
      <MenuGrid />

      {/* ── Info Strip ── */}
      <div className="mt-10">
        <InfoStrip items={infoItems} />
      </div>

      {/* ── Confirmation Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-accent/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4 text-danger">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="text-text font-extrabold text-lg mb-2">Konfirmasi Darurat</h3>
            <p className="text-text/70 text-xs mb-6 leading-relaxed">
              Apakah Anda yakin ingin mengaktifkan sinyal Panic? Tindakan ini akan mencatat lokasi GPS Anda dan mengirimkan pemberitahuan darurat ke kontak Anda.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-accent/30 bg-white hover:bg-accent/5 text-text text-sm font-bold transition-all cursor-pointer shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={triggerPanicAlert}
                className="flex-1 py-3 px-4 rounded-xl bg-danger hover:opacity-90 text-white text-sm font-bold transition-all cursor-pointer shadow-sm"
              >
                Ya, Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
