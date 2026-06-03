import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function OnboardingGuard({ children }) {
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    async function checkStatus() {
      try {
        const data = await authFetch("/users/onboarding-status");
        if (active) {
          setCompleted(data.completed);
          setLoading(false);
        }
      } catch (err) {
        console.error("Onboarding status check failed:", err);
        if (active) {
          setLoading(false);
        }
      }
    }
    checkStatus();
    return () => { active = false; };
  }, [authFetch, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text text-sm font-bold">
        Memeriksa status profil Anda...
      </div>
    );
  }

  if (!completed) {
    return <Navigate to="/user/onboarding" replace />;
  }

  return children;
}
