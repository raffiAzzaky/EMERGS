import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
} from "../services/api";

const INITIAL_FORM = {
  blood_type: "",
  allergies: "",
  disease_history: "",
};

export function useMedicalRecord() {
  const { authFetch } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [recordExists, setRecordExists] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadRecord = async () => {
      setLoading(true);
      setError(null);

      try {
        const record = await getMedicalRecord(authFetch);
        if (mounted) {
          setForm({
            blood_type: record.blood_type || "",
            allergies: record.allergies || "",
            disease_history: record.disease_history || "",
          });
          setRecordExists(true);
        }
      } catch (err) {
        if (mounted) {
          if (err.status === 404) {
            setForm(INITIAL_FORM);
            setRecordExists(false);
          } else {
            setError(err.message || "Gagal memuat data medis");
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRecord();
    return () => {
      mounted = false;
    };
  }, [authFetch]);

  const setField = useCallback(
    (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
    []
  );

  const saveRecord = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      if (recordExists) {
        await updateMedicalRecord(authFetch, {
          blood_type: form.blood_type,
          allergies: form.allergies,
          disease_history: form.disease_history,
        });
      } else {
        await createMedicalRecord(authFetch, {
          blood_type: form.blood_type,
          allergies: form.allergies,
          disease_history: form.disease_history,
        });
        setRecordExists(true);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Gagal menyimpan data medis");
    } finally {
      setSaving(false);
    }
  }, [authFetch, form, recordExists]);

  return {
    form,
    loading,
    saving,
    saved,
    error,
    recordExists,
    setField,
    saveRecord,
  };
}
