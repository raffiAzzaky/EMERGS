import { useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNavbar from "../components/user/BottomNavbar";
import UserSidebar from "../components/user/UserSidebar";

/**
 * UserLayout
 * ─────────────────────────────────────────────
 * Responsive Layout.
 * - Mobile (<768px): BottomNavbar fixed at bottom.
 * - Tablet (768px - 1024px): Collapsible Sidebar on left (80px - 240px).
 * - Desktop (>1024px): Fixed permanent Sidebar on left (240px).
 * - Content uses max-w-7xl and mx-auto in desktop mode.
 */
export default function UserLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans text-text transition-colors duration-300">
      {/* Responsive Sidebar — shown on Tablet/Desktop */}
      <UserSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 overflow-auto pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Navigation — shown on Mobile only */}
      <BottomNavbar />
    </div>
  );
}

