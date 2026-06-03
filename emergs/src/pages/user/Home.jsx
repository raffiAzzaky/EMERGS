/**
 * pages/user/Home.jsx
 *
 * Main dashboard page for the user.
 * Composes: StatusBar, PanicButton, SectionDivider, MenuGrid, InfoStrip.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { triggerPanic } from "../../services/api";

import PanicButton    from "../../components/user/PanicButton";
import MenuGrid       from "../../components/user/MenuGrid";
import InfoStrip      from "../../components/user/InfoStrip";
import SectionDivider from "../../components/common/SectionDivider";
import StatusBar      from "../../components/admin/StatusBar";

export default function Home() {
  const [panicActive, setPanicActive] = useState(false);
  const { authFetch } = useAuth();

  const handlePanic = async () => {
    if (panicActive) return;
    setPanicActive(true);

    try {
      let location = {};
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        } catch (err) {
          console.warn("Could not get location:", err);
        }
      }

      await triggerPanic(authFetch, {
        location,
        panic_type: "emergency",
        description: "User triggered panic button from dashboard"
      });
    } catch (error) {
      console.error("Failed to trigger panic:", error);
      alert("Gagal mengirim sinyal darurat! " + error.message);
    } finally {
      setTimeout(() => setPanicActive(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">

      {/* ── Status bar ── */}
      <div className="mb-10">
        <StatusBar />
      </div>

      {/* ── Panic Button ── */}
      <PanicButton onPress={handlePanic} active={panicActive} />

      {/* ── Menu Grid ── */}
      <SectionDivider label="Menu Utama" />
      <MenuGrid />

      {/* ── Info Strip ── */}
      <div className="mt-10">
        <InfoStrip />
      </div>
    </div>
  );
}
