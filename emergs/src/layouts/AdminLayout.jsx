import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useAuth } from "../hooks/useAuth";

// Map route paths to human-readable page titles
const PAGE_TITLES = {
  "/admin":                     "Dashboard Utama",
  "/admin/users":               "Manajemen Pengguna",
  "/admin/panic-monitoring":    "Monitoring Panic",
  "/admin/medical-monitoring":  "Monitoring Medis",
  "/admin/notification-logs":   "Log Notifikasi",
  "/admin/settings":            "Pengaturan",
};

/**
 * AdminLayout
 * ─────────────────────────────────────────────
 * Desktop-first layout.
 * - Fixed Sidebar on the left (collapsible on narrow screens)
 * - Top Header with page title + bell icon
 * - max-w-7xl mx-auto content container
 * - Outlet renders the active admin page
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();

  const pageTitle = PAGE_TITLES[pathname] ?? "Admin Panel";

  return (
    <div className="min-h-screen bg-background flex font-sans text-text transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <Header
          pageTitle={pageTitle}
          user={user}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
