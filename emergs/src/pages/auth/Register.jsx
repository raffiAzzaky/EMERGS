import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(form);
      navigate("/user");
    } catch (err) {
      setError(err.message || "Gagal mendaftar. Coba lagi nanti.");
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
          <h2 className="text-text font-bold text-lg mb-5">Buat akun baru</h2>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Nama Lengkap", type: "text", ph: "Ahmad Rizky" },
              { key: "email", label: "Email", type: "email", ph: "email@contoh.com" },
              { key: "password", label: "Password", type: "password", ph: "Min. 8 karakter" },
            ].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="block text-text/75 text-xs font-bold uppercase tracking-wide mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  required
                  placeholder={ph}
                  value={form[key]}
                  onChange={set(key)}
                  className="w-full bg-white border border-accent/30 rounded-xl px-4 py-2.5 text-sm text-text placeholder-text/45 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:opacity-90 text-text font-bold text-sm transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 mt-2 shadow-sm border border-primary/20 cursor-pointer"
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-text/60 text-sm mt-4">
            Sudah punya akun? {" "}
            <Link to="/login" className="text-text hover:text-accent font-bold transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
