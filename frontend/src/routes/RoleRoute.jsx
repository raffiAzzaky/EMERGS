import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Wraps a route that requires a specific role.
 * @param {string} allowedRole - "user" | "admin"
 */
export default function RoleRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== allowedRole) {
    // Redirect to the correct area based on actual role
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
  }

  return children;
}
