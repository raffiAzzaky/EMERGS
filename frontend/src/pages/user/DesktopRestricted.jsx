import { MapPin, PhoneCall, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DesktopRestricted() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleLogout();
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 text-text font-sans selection:bg-primary/20 transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10 pointer-events-none" />

      <div className="w-full max-w-lg bg-card border border-accent/25 rounded-3xl p-8 lg:p-12 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative background pulse ring */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 blur-xl pointer-events-none" />
        
        {/* Animated Brand Logo Icon */}
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-8 shadow-lg border border-primary/20 animate-pulse">
          <MapPin className="w-10 h-10 text-text" />
        </div>

        {/* Title */}
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-4 leading-tight">
          Akses Terbatas
        </h1>
        
        {/* Subtitle */}
        <div className="h-px w-16 bg-primary/60 mb-6" />

        {/* Message */}
        <p className="text-text/75 text-sm lg:text-base mb-8 leading-relaxed">
          EMERGs User App hanya dapat diakses melalui perangkat <span className="font-bold text-text">Mobile</span> or <span className="font-bold text-text">Tablet</span>. Silakan gunakan perangkat portabel Anda untuk mengakses dashboard kesehatan darurat.
        </p>

        {/* Info Box */}
        <div className="w-full rounded-2xl bg-accent/5 border border-accent/15 px-4 py-3 flex items-center gap-3.5 mb-8 text-left">
          <PhoneCall className="w-5 h-5 text-accent flex-shrink-0" />
          <p className="text-xs text-text/70 leading-normal">
            Pengecekan ini diaktifkan untuk memastikan integrasi modul lokasi GPS serta respons fisik tombol panic bekerja optimal di lapangan.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleBack}
            className="flex-1 py-3 px-4 rounded-xl border border-accent/30 bg-card hover:bg-accent/5 text-text text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          
          <button
            onClick={handleLogout}
            className="flex-1 py-3 px-4 rounded-xl bg-danger hover:opacity-90 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Keluar Akun
          </button>
        </div>
      </div>

      {/* Footer footer info */}
      <p className="text-text/40 text-xs mt-8 font-medium">
        EMERGs Emergency Health Monitoring &bull; User Role Restriction
      </p>
    </div>
  );
}
