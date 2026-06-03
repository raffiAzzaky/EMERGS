import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// User pages
import Home from "../pages/user/Home";
import History from "../pages/user/History";
import Profile from "../pages/user/Profile";
import MedicalHistory from "../pages/user/MedicalHistory";
import EmergencyContacts from "../pages/user/EmergencyContacts";
import Notifications from "../pages/user/Notifications";
import UserSettings from "../pages/user/Settings";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import PanicMonitoring from "../pages/admin/PanicMonitoring";
import MedicalMonitoring from "../pages/admin/MedicalMonitoring";
import NotificationLogs from "../pages/admin/NotificationLogs";
import AdminSettings from "../pages/admin/Settings";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Default redirect ─────────────────────────── */}
      <Route path="/" element={<Navigate to="/user" replace />} />

      {/* ── Auth ─────────────────────────────────────── */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── User (protected) ─────────────────────────── */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="user">
              <UserLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index             element={<Home />} />
        <Route path="history"      element={<History />} />
        <Route path="profile"      element={<Profile />} />
        <Route path="medical"      element={<MedicalHistory />} />
        <Route path="contacts"     element={<EmergencyContacts />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings"     element={<UserSettings />} />
      </Route>

      {/* ── Admin (protected) ────────────────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="admin">
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index                   element={<AdminDashboard />} />
        <Route path="users"            element={<AdminUsers />} />
        <Route path="panic-monitoring" element={<PanicMonitoring />} />
        <Route path="medical-monitoring" element={<MedicalMonitoring />} />
        <Route path="notification-logs" element={<NotificationLogs />} />
        <Route path="settings"         element={<AdminSettings />} />
      </Route>

      {/* ── 404 fallback ─────────────────────────────── */}
      <Route path="*" element={<Navigate to="/user" replace />} />
    </Routes>
  );
}
