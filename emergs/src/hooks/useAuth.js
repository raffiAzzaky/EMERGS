import { createContext, useContext, useState, useEffect, useCallback, createElement } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const AUTH_TOKEN_KEY = "emergs_token";
const AUTH_USER_KEY = "emergs_user";

const AuthContext = createContext(null);

const parseStoredUser = () => {
  const stored = localStorage.getItem(AUTH_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(() => parseStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      const message = data?.message || response.statusText || "Request failed";
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    return data;
  };

  const authFetch = useCallback(
    async (path, options = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
      });
      return handleResponse(response);
    },
    [token, logout]
  );

  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await handleResponse(response);
        setToken(data.token);
        setUser(data.user);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await handleResponse(response);
        setToken(data.token);
        setUser(data.user);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  return createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        authFetch,
      },
    },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
