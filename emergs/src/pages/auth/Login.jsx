import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(form);
      navigate("/user");
    } catch (err) {
      setError(err.message || "Gagal masuk. Cek kembali kredensial Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-3 shadow-md border border-primary/20">
            <MapPin className="w-7 h-7 text-text" />
          </div>
          <h1 className="text-text text-2xl font-bold tracking-tight">EMERGS</h1>
          <p className="text-text/60 text-sm mt-1 font-medium">Emergency Health System</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-accent/20 rounded-2xl p-6 shadow-lg">
          <h2 className="text-text font-bold text-lg mb-5">Masuk ke akun Anda</h2>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-text/75 text-xs font-bold uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="email@contoh.com"
                value={form.email}
                onChange={set("email")}
                className="w-full bg-white border border-accent/30 rounded-xl px-4 py-2.5 text-sm text-text placeholder-text/45 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-text/75 text-xs font-bold uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  className="w-full bg-white border border-accent/30 rounded-xl px-4 py-2.5 pr-10 text-sm text-text placeholder-text/45 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:opacity-90 text-text font-bold text-sm transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 mt-2 shadow-sm border border-primary/20 cursor-pointer"
            >
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-text/60 text-sm mt-4">
            Belum punya akun? {" "}
            <Link to="/register" className="text-text hover:text-accent font-bold transition-colors">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
