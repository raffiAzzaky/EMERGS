import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Heart, ArrowRight, ArrowLeft, Save, MapPin } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

export default function Onboarding() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    ttl: "",
    alamat: "",
    phone: "",
    nik: "",
    jenis_kelamin: "Laki-laki",
    blood_type: "A+",
    allergies: "",
    disease_history: "",
    contact_name: "",
    contact_phone: "",
    contact_relationship: "Keluarga"
  });

  useEffect(() => {
    // Check if onboarding is already completed, if yes, redirect to home
    const verifyStatus = async () => {
      try {
        const res = await authFetch("/users/onboarding-status");
        if (res.completed) {
          navigate("/user", { replace: true });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };
    verifyStatus();
  }, [authFetch, navigate]);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.name || !form.ttl || !form.alamat || !form.phone) {
        setError("Harap isi semua kolom wajib pada Data Diri");
        return;
      }
    } else if (step === 2) {
      if (!form.contact_name || !form.contact_phone) {
        setError("Harap isi semua kolom wajib pada Kontak Darurat");
        return;
      }
    }
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.blood_type || !form.allergies || !form.disease_history) {
      setError("Harap isi semua kolom wajib pada Informasi Medis");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await authFetch("/users/onboarding", {
        method: "POST",
        body: JSON.stringify(form)
      });
      navigate("/user", { replace: true });
    } catch (err) {
      setError(err.message || "Gagal menyimpan data onboarding.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text font-bold">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-card border border-accent/20 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3 shadow-md border border-primary/20">
            <MapPin className="w-6 h-6 text-text" />
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-text">Lengkapi Profil EMERGs</h1>
          <p className="text-xs text-text/60 mt-1">Lengkapi informasi berikut sebelum menggunakan dashboard utama.</p>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center mb-8 px-4">
          {[
            { num: 1, label: "Data Diri", icon: User },
            { num: 2, label: "Kontak", icon: Phone },
            { num: 3, label: "Medis", icon: Heart }
          ].map((s) => {
            const Icon = s.icon;
            const active = step >= s.num;
            const current = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center relative flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold text-sm transition-all duration-300 ${
                    current 
                      ? "bg-primary border-primary text-text shadow-md scale-110" 
                      : active 
                        ? "bg-primary/40 border-primary text-text/90" 
                        : "bg-card border-accent/30 text-text/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold mt-2 tracking-wider uppercase ${current ? "text-text" : "text-text/50"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-5">
          {/* STEP 1: Data Diri */}
          {step === 1 && (
            <div className="space-y-4">
              <InputField
                theme="light"
                label="Nama Lengkap *"
                required
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Masukkan nama lengkap"
              />
              <InputField
                theme="light"
                label="NIK (Nomor Induk Kependudukan)"
                value={form.nik}
                onChange={handleChange("nik")}
                placeholder="Masukkan 16 digit NIK"
              />
              <InputField
                theme="light"
                label="Tempat, Tanggal Lahir * (Contoh: Jakarta, 12 Agustus 1995)"
                required
                value={form.ttl}
                onChange={handleChange("ttl")}
                placeholder="Contoh: Surabaya, 1 Januari 1990"
              />
              <InputField
                theme="light"
                label="Jenis Kelamin *"
                type="select"
                value={form.jenis_kelamin}
                onChange={handleChange("jenis_kelamin")}
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </InputField>
              <InputField
                theme="light"
                label="Nomor Telepon / HP *"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="Contoh: 08123456789"
              />
              <InputField
                theme="light"
                label="Alamat Lengkap *"
                type="textarea"
                required
                rows={2}
                value={form.alamat}
                onChange={handleChange("alamat")}
                placeholder="Masukkan alamat tinggal saat ini"
              />
            </div>
          )}

          {/* STEP 2: Kontak Darurat */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-2">
                <p className="text-xs text-text/80 leading-relaxed font-semibold">
                  Kontak darurat akan secara otomatis dihubungi dan menerima pemberitahuan koordinat GPS ketika Anda mengaktifkan tombol Panic.
                </p>
              </div>
              <InputField
                theme="light"
                label="Nama Kontak Darurat *"
                required
                value={form.contact_name}
                onChange={handleChange("contact_name")}
                placeholder="Nama penanggung jawab"
              />
              <InputField
                theme="light"
                label="Nomor HP Kontak Darurat *"
                type="tel"
                required
                value={form.contact_phone}
                onChange={handleChange("contact_phone")}
                placeholder="Contoh: 08129999999"
              />
              <InputField
                theme="light"
                label="Hubungan *"
                type="select"
                value={form.contact_relationship}
                onChange={handleChange("contact_relationship")}
              >
                <option value="Orang Tua">Orang Tua</option>
                <option value="Suami / Istri">Suami / Istri</option>
                <option value="Anak">Anak</option>
                <option value="Keluarga">Keluarga</option>
                <option value="Teman">Teman</option>
              </InputField>
            </div>
          )}

          {/* STEP 3: Informasi Medis */}
          {step === 3 && (
            <div className="space-y-4">
              <InputField
                theme="light"
                label="Golongan Darah *"
                type="select"
                value={form.blood_type}
                onChange={handleChange("blood_type")}
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </InputField>
              <InputField
                theme="light"
                label="Riwayat Alergi * (Ketik '-' jika tidak ada)"
                required
                value={form.allergies}
                onChange={handleChange("allergies")}
                placeholder="Masukkan alergi makanan, obat, atau lingkungan"
              />
              <InputField
                theme="light"
                label="Riwayat Penyakit * (Ketik '-' jika tidak ada)"
                type="textarea"
                required
                rows={3}
                value={form.disease_history}
                onChange={handleChange("disease_history")}
                placeholder="Contoh: Asma, Hipertensi, Diabetes"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-accent/15 mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                iconLeft={<ArrowLeft className="w-4 h-4" />}
                onClick={handleBack}
                disabled={loading}
              >
                Kembali
              </Button>
            )}
            
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
              iconRight={step < 3 ? <ArrowRight className="w-4 h-4" /> : undefined}
              iconLeft={step === 3 ? <Save className="w-4 h-4" /> : undefined}
            >
              {loading ? "Menyimpan..." : step < 3 ? "Lanjut" : "Simpan & Masuk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
