/**
 * pages/user/Profile.jsx
 *
 * User profile page with:
 *  - Banner + circular avatar
 *  - Edit / Save / Cancel actions
 *  - 2-column form grid (grid-cols-2 on desktop)
 *  - Three sections: Data Diri, Kontak, Informasi Medis
 *
 * Logic is extracted to hooks/useProfileForm.js to keep this file lean.
 */

import {
  User, Camera, Edit3, Save, UserCheck,
  MapPin as MapPinIcon, Calendar, Phone, Mail, ShieldCheck,
} from "lucide-react";

import InputField      from "../../components/common/InputField";
import SectionDivider  from "../../components/common/SectionDivider";
import Button          from "../../components/common/Button";
import { useProfileForm } from "../../hooks/useProfileForm";

// ── Golongan darah options ──────────────────────────────────
const GOL_DARAH = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Profile() {
  const {
    form,
    editing,
    saved,
    loading,
    saving,
    error,
    setField,
    startEdit,
    cancelEdit,
    saveForm,
  } = useProfileForm();

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 lg:py-10">
      <div className="bg-card rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">

        {/* ── Banner ── */}
        <div className="h-28 bg-gradient-to-r from-sidebar to-primary relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* ── Card body ── */}
        <div className="px-6 lg:px-8 pb-8">
          {loading && (
            <div className="mb-4 rounded-2xl bg-accent/10 border border-accent/30 p-4 text-sm text-text/80">
              Memuat data profil...
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {/* Avatar row */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 -mt-12 mb-6">

            {/* Avatar */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary border-4 border-white shadow-md flex items-center justify-center text-text">
                <User className="w-11 h-11 text-text" />
              </div>
              {editing && (
                <button
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-accent border-2 border-white flex items-center justify-center hover:bg-accent/80 transition-colors"
                  aria-label="Ganti foto profil"
                >
                  <Camera className="w-3.5 h-3.5 text-text" />
                </button>
              )}
            </div>

            {/* Name + badge */}
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-text text-xl font-bold leading-none tracking-tight">
                  {form.nama}
                </h2>
                <span className="flex items-center gap-1 bg-primary/30 text-text text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-text" />
                  Pasien Aktif
                </span>
              </div>
              <p className="text-text/60 text-sm mt-2">NIK: {form.nik}</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pb-1">
              {saved && (
                <span className="flex items-center gap-1.5 text-text text-sm font-bold">
                  <UserCheck className="w-4 h-4 text-text" />
                  Tersimpan!
                </span>
              )}
              {editing ? (
                <>
                  <Button variant="outline" size="sm" onClick={cancelEdit} disabled={loading || saving}>
                    Batal
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    iconLeft={<Save className="w-4 h-4" />}
                    onClick={saveForm}
                    disabled={loading || saving}
                  >
                    Simpan
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<Edit3 className="w-4 h-4" />}
                  onClick={startEdit}
                  disabled={loading}
                >
                  Edit Profil
                </Button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-accent/15 mb-6" />

          {/* ── Section: Data Diri ── */}
          <SectionLabel label="Data Diri" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <InputField
              theme="light"
              label="NIK"
              name="nik"
              value={form.nik}
              onChange={setField("nik")}
              readOnly={!editing}
            />
            <InputField
              theme="light"
              label="Nama Lengkap"
              name="nama"
              value={form.nama}
              onChange={setField("nama")}
              readOnly={!editing}
            />
            <InputField
              theme="light"
              label="Tempat, Tanggal Lahir"
              name="ttl"
              value={form.ttl}
              onChange={setField("ttl")}
              readOnly={!editing}
              iconLeft={<Calendar className="w-3.5 h-3.5" />}
            />
            <InputField
              theme="light"
              label="Jenis Kelamin"
              name="jenisKelamin"
              type={editing ? "select" : "text"}
              value={form.jenisKelamin}
              onChange={setField("jenisKelamin")}
              readOnly={!editing}
            >
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </InputField>

            {/* Alamat — full width */}
            <div className="lg:col-span-2">
              <InputField
                theme="light"
                label="Alamat"
                name="alamat"
                type="textarea"
                value={form.alamat}
                onChange={setField("alamat")}
                readOnly={!editing}
                iconLeft={<MapPinIcon className="w-3.5 h-3.5" />}
                rows={2}
              />
            </div>
          </div>

          {/* ── Section: Kontak ── */}
          <SectionLabel label="Kontak" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <InputField
              theme="light"
              label="No. HP"
              name="noHp"
              type="tel"
              value={form.noHp}
              onChange={setField("noHp")}
              readOnly={!editing}
              iconLeft={<Phone className="w-3.5 h-3.5" />}
            />
            <InputField
              theme="light"
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={setField("email")}
              readOnly={!editing}
              iconLeft={<Mail className="w-3.5 h-3.5" />}
            />
          </div>

          {/* ── Section: Informasi Medis ── */}
          <SectionLabel label="Informasi Medis" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              theme="light"
              label="Golongan Darah"
              name="golDarah"
              type={editing ? "select" : "text"}
              value={form.golDarah}
              onChange={setField("golDarah")}
              readOnly={!editing}
            >
              {GOL_DARAH.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </InputField>
            <InputField
              theme="light"
              label="Alergi"
              name="alergi"
              value={form.alergi}
              onChange={setField("alergi")}
              readOnly={!editing}
              placeholder={editing ? "Tulis alergi obat atau makanan..." : ""}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Internal helper: section label with lines ───────────────
function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-4 h-px bg-accent/40" />
      <span className="text-text/70 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-accent/15" />
    </div>
  );
}
