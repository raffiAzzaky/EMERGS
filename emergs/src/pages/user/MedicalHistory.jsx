/**
 * pages/user/MedicalHistory.jsx
 *
 * Displays the user's medical record and additional medical category cards.
 */

import {
  Stethoscope,
  AlertTriangle,
  Pill,
  NotebookPen,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import MedicalCard from "../../components/user/MedicalCard";
import { MEDICAL_CATEGORIES } from "../../data/medicalCategories";
import { useMedicalRecord } from "../../hooks/useMedicalRecord";

const ICON_MAP = {
  Stethoscope,
  AlertTriangle,
  Pill,
  NotebookPen,
};

export default function MedicalHistory() {
  const {
    form,
    loading,
    saving,
    saved,
    error,
    setField,
    saveRecord,
  } = useMedicalRecord();

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 lg:py-10">
      <PageHeader
        title="Medical History"
        subtitle="Data medis Anda tersimpan di backend"
      />

      <div className="rounded-3xl border border-accent/10 bg-white p-6 shadow-sm mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-text">Rekam Medis</h2>
            <p className="text-text/60 text-sm">
              Kelola informasi golongan darah, alergi, dan riwayat penyakit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="rounded-full bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                Tersimpan
              </span>
            )}
            <button
              type="button"
              onClick={saveRecord}
              disabled={loading || saving}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-bold text-text transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Rekam Medis"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-accent/10 p-6 text-center text-text/70">
            Memuat data medis...
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              <div className="rounded-3xl border border-accent/10 bg-accent/5 p-4">
                <label className="block text-text/70 text-xs font-bold uppercase tracking-widest mb-2">
                  Golongan Darah
                </label>
                <input
                  type="text"
                  value={form.blood_type}
                  onChange={setField("blood_type")}
                  placeholder="A+, B-, O+, ..."
                  className="w-full rounded-2xl border border-accent/20 bg-white px-4 py-3 text-sm text-text outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-3xl border border-accent/10 bg-white p-4">
                <label className="block text-text/70 text-xs font-bold uppercase tracking-widest mb-2">
                  Alergi
                </label>
                <input
                  type="text"
                  value={form.allergies}
                  onChange={setField("allergies")}
                  placeholder="Contoh: Penisilin, kacang"
                  className="w-full rounded-2xl border border-accent/20 bg-white px-4 py-3 text-sm text-text outline-none focus:border-primary"
                />
              </div>
              <div className="rounded-3xl border border-accent/10 bg-white p-4">
                <label className="block text-text/70 text-xs font-bold uppercase tracking-widest mb-2">
                  Riwayat Penyakit
                </label>
                <textarea
                  value={form.disease_history}
                  onChange={setField("disease_history")}
                  rows={4}
                  placeholder="Contoh: Asma, hipertensi, diabetes"
                  className="w-full rounded-3xl border border-accent/20 bg-white px-4 py-3 text-sm text-text outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {MEDICAL_CATEGORIES.map((category) => {
          const IconComponent = ICON_MAP[category.iconName];
          const icon = IconComponent ? (
            <IconComponent className="w-5 h-5 text-text/70" />
          ) : null;

          return (
            <MedicalCard
              key={category.id}
              category={category}
              icon={icon}
              isOpen={false}
              onToggle={() => {}}
            />
          );
        })}
      </div>

      <p className="text-center text-text/50 text-xs">
        Terakhir diperbarui: data medis selalu disinkronkan dengan server.
      </p>
    </div>
  );
}
