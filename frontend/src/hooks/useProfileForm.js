/**
 * hooks/useProfileForm.js
 *
 * Manages profile form state, edit mode, and save logic.
 * Fetches user profile and medical record from backend.
 */

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  getProfile,
  updateProfile,
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
} from "../services/api";

const INITIAL_FORM = {
  nik: "",
  nama: "",
  ttl: "",
  alamat: "",
  jenisKelamin: "",
  noHp: "",
  email: "",
  golDarah: "",
  alergi: "",
};

export function useProfileForm() {
  const { authFetch } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [original, setOriginal] = useState(INITIAL_FORM);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [medicalRecordExists, setMedicalRecordExists] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const profile = await getProfile(authFetch);
        const medical = await getMedicalRecord(authFetch).catch((err) => {
          if (err.status === 404) {
            return null;
          }
          throw err;
        });

        const combined = {
          nik: profile.nik,
          nama: profile.name,
          ttl: profile.ttl,
          alamat: profile.alamat,
          jenisKelamin: profile.jenisKelamin,
          noHp: profile.noHp,
          email: profile.email,
          golDarah: medical?.blood_type || "",
          alergi: medical?.allergies || "",
        };

        if (mounted) {
          setForm(combined);
          setOriginal(combined);
          setMedicalRecordExists(Boolean(medical));
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Gagal memuat profil");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [authFetch]);

  const setField = useCallback(
    (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
    []
  );

  const startEdit = useCallback(() => setEditing(true), []);
  const cancelEdit = useCallback(() => {
    setForm(original);
    setEditing(false);
  }, [original]);

  const saveForm = useCallback(async () => {
    setSaving(true);
    setError(null);

    const profileUpdates = {
      name: form.nama,
      email: form.email,
      nik: form.nik,
      ttl: form.ttl,
      alamat: form.alamat,
      jenisKelamin: form.jenisKelamin,
      noHp: form.noHp,
    };

    const medicalUpdates = {
      blood_type: form.golDarah,
      allergies: form.alergi,
    };

    try {
      await updateProfile(authFetch, profileUpdates);

      if (medicalRecordExists) {
        await updateMedicalRecord(authFetch, medicalUpdates);
      } else {
        await createMedicalRecord(authFetch, {
          ...medicalUpdates,
          disease_history: "",
        });
        setMedicalRecordExists(true);
      }

      setOriginal(form);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  }, [authFetch, form, medicalRecordExists]);

  return {
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
  };
}
