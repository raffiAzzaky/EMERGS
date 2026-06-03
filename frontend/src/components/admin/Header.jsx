import { useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

export default function Header({ pageTitle, user, onMenuToggle }) {
  const navigate = useNavigate();

  return (
    <header className="bg-sidebar/80 backdrop-blur-md border-b border-accent/20 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20 transition-all duration-300">
      {/* Hamburger — mobile only */}
      <button
        className="lg:hidden text-text/60 hover:text-text transition-colors p-1"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Page title — hidden on mobile */}
      <div className="hidden lg:flex flex-col">
        <h1 className="text-text text-xl font-bold leading-none tracking-tight">{pageTitle}</h1>
        <p className="text-text/60 text-sm mt-1 font-medium">
          Selamat datang, {user?.name ?? "Admin"}
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={() => navigate("/admin/notification-logs")}
          className="relative p-2.5 rounded-xl bg-accent/10 hover:bg-accent/20 text-text transition-all duration-200"
          aria-label="Notifikasi"
        >
          <Bell className="w-5 h-5 text-text/70 group-hover:text-text" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
      </div>
    </header>
  );
}
