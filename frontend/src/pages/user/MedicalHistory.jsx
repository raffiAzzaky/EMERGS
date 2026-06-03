/**
 * pages/user/MedicalHistory.jsx
 *
 * Displays the user's medical record and additional medical category cards.
 */

import { useState, useEffect } from "react";
import {
  Stethoscope,
  AlertTriangle,
  Pill,
  NotebookPen,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import MedicalCard from "../../components/user/MedicalCard";
import { useMedicalRecord } from "../../hooks/useMedicalRecord";
import { useAuth } from "../../hooks/useAuth";
import { getMedicalRecord } from "../../services/api";

const ICON_MAP = {
  Stethoscope,
  AlertTriangle,
  Pill,
  NotebookPen,
};

export default function MedicalHistory() {
  const {
    form,
    loading: mainLoading,
    saving,
    saved,
    error: mainError,
    setField,
    saveRecord,
    recordExists,
    setForm
  } = useMedicalRecord();

  const { authFetch } = useAuth();
  
  // Accordion and sub-tables state
  const [expandedCard, setExpandedCard] = useState(null);
  const [allergiesList, setAllergiesList] = useState([]);
  const [medicationsList, setMedicationsList] = useState([]);
  const [notesList, setNotesList] = useState([]);
  const [subLoading, setSubLoading] = useState(true);

  const loadSubData = async () => {
    try {
      const aRes = await authFetch("/medical/allergies");
      setAllergiesList(aRes.allergies || []);

      const mRes = await authFetch("/medical/medications");
      setMedicationsList(mRes.medications || []);

      const nRes = await authFetch("/medical/notes");
      setNotesList(nRes.notes || []);
    } catch (err) {
      console.error("Failed to load sub-tables data:", err);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    loadSubData();
  }, [authFetch]);

  const handleAddEntry = async (type, payload) => {
    try {
      if (type === "alergi") {
        await authFetch("/medical/allergies", {
          method: "POST",
          body: JSON.stringify({ 
            name: payload.name, 
            severity: payload.severity || 'Mild', 
            notes: payload.notes || '' 
          })
        });
      } else if (type === "obat") {
        await authFetch("/medical/medications", {
          method: "POST",
          body: JSON.stringify({ 
            name: payload.name, 
            dosage: payload.dosage || '', 
            frequency: payload.frequency || '', 
            notes: payload.notes || '' 
          })
        });
      } else if (type === "catatan") {
        await authFetch("/medical/notes", {
          method: "POST",
          body: JSON.stringify({ note: payload.note })
        });
      }
      
      // Reload sub-tables
      await loadSubData();
      
      // Sync text field of main record
      const record = await getMedicalRecord(authFetch);
      if (record) {
        setForm({
          blood_type: record.blood_type || "",
          allergies: record.allergies || "",
          disease_history: record.disease_history || "",
        });
      }
    } catch (err) {
      console.error("Failed to add entry:", err);
    }
  };

  const handleDeleteEntry = async (type, id) => {
    try {
      if (type === "alergi") {
        await authFetch(`/medical/allergies/${id}`, { method: "DELETE" });
      } else if (type === "obat") {
        await authFetch(`/medical/medications/${id}`, { method: "DELETE" });
      } else if (type === "catatan") {
        await authFetch(`/medical/notes/${id}`, { method: "DELETE" });
      }

      // Reload sub-tables
      await loadSubData();

      // Sync text field of main record
      const record = await getMedicalRecord(authFetch);
      if (record) {
        setForm({
          blood_type: record.blood_type || "",
          allergies: record.allergies || "",
          disease_history: record.disease_history || "",
        });
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  // Construct categories based on MySQL records
  const categories = [
    {
      id: "penyakit",
      iconName: "Stethoscope",
      label: "Riwayat Penyakit",
      desc: "Daftar diagnosis dan rekam medis",
      badge: form.disease_history ? `${form.disease_history.split(',').filter(x => x.trim()).length} Item` : "0 Item",
      entries: form.disease_history ? form.disease_history.split(',').map((x, idx) => ({
        id: idx,
        date: "Aktif",
        title: x.trim(),
        note: "Tercatat di rekam medis"
      })) : [],
      isManageable: false
    },
    {
      id: "alergi",
      iconName: "AlertTriangle",
      label: "Riwayat Alergi",
      desc: "Obat, makanan, dan zat pemicu alergi",
      badge: `${allergiesList.length} Item`,
      entries: allergiesList.map(a => ({
        id: a.id,
        date: new Date(a.created_at).toLocaleDateString("id-ID"),
        title: a.allergy_name,
        note: a.notes ? `${a.notes} (Tingkat: ${a.severity})` : `Reaksi tingkat: ${a.severity}`
      })),
      isManageable: true
    },
    {
      id: "obat",
      iconName: "Pill",
      label: "Riwayat Obat",
      desc: "Obat yang sedang atau pernah dikonsumsi",
      badge: `${medicationsList.length} Item`,
      entries: medicationsList.map(m => ({
        id: m.id,
        date: m.frequency || "Aktif",
        title: m.medicine_name,
        note: m.dosage ? `Dosis: ${m.dosage}. ${m.notes || ""}` : m.notes || "Penggunaan aktif"
      })),
      isManageable: true
    },
    {
      id: "catatan",
      iconName: "NotebookPen",
      label: "Catatan Medis",
      desc: "Catatan dokter dan instruksi khusus",
      badge: `${notesList.length} Catatan`,
      entries: notesList.map(n => ({
        id: n.id,
        date: new Date(n.created_at).toLocaleDateString("id-ID"),
        title: "Catatan Dokter",
        note: n.note
      })),
      isManageable: true
    }
  ];

  const handleToggleCard = (id) => {
    setExpandedCard(prev => prev === id ? null : id);
  };

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
              disabled={mainLoading || saving}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-bold text-text transition hover:opacity-90 disabled:opacity-60 cursor-pointer border border-primary/20 shadow-sm"
            >
              {saving ? "Menyimpan..." : "Simpan Rekam Medis"}
            </button>
          </div>
        </div>

        {mainLoading ? (
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
                  Alergi (Pisahkan dengan koma)
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
                  Riwayat Penyakit (Pisahkan dengan koma)
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

        {mainError && (
          <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {mainError}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {categories.map((category) => {
          const IconComponent = ICON_MAP[category.iconName];
          const icon = IconComponent ? (
            <IconComponent className="w-5 h-5 text-text/70" />
          ) : null;

          return (
            <MedicalCard
              key={category.id}
              category={category}
              icon={icon}
              isOpen={expandedCard === category.id}
              onToggle={() => handleToggleCard(category.id)}
              onAddEntry={handleAddEntry}
              onDeleteEntry={handleDeleteEntry}
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
