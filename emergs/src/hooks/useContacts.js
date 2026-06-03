/**
 * hooks/useContacts.js
 *
 * Manages emergency contact list state and syncs with backend.
 */

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact as deleteContactApi,
} from "../services/api";

const EMPTY_FORM = { nama: "", hp: "", hubungan: "", prioritas: "Biasa" };

const mapServerContact = (contact) => ({
  id: contact.id,
  nama: contact.name,
  hp: contact.phone,
  hubungan: contact.relationship || "",
  prioritas: contact.priority || "Biasa",
});

export function useContacts() {
  const { authFetch } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadContacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const serverContacts = await getContacts(authFetch);
        if (mounted) {
          setContacts(serverContacts.map(mapServerContact));
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Gagal memuat kontak");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadContacts();
    return () => {
      mounted = false;
    };
  }, [authFetch]);

  const setField = useCallback(
    (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
    []
  );

  const openAdd = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setShowModal(true);
  }, []);

  const openEdit = useCallback((contact) => {
    setForm({
      nama: contact.nama,
      hp: contact.hp,
      hubungan: contact.hubungan,
      prioritas: contact.prioritas,
    });
    setEditTarget(contact.id);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditTarget(null);
  }, []);

  const saveContactHandler = useCallback(async () => {
    if (!form.nama.trim() || !form.hp.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (editTarget) {
        await updateContact(authFetch, editTarget, {
          name: form.nama,
          phone: form.hp,
          relationship: form.hubungan,
          priority: form.prioritas,
        });
        setContacts((cs) =>
          cs.map((c) => (c.id === editTarget ? { ...c, ...form } : c))
        );
      } else {
        const newContact = await createContact(authFetch, {
          name: form.nama,
          phone: form.hp,
          relationship: form.hubungan,
          priority: form.prioritas,
        });
        setContacts((cs) => [...cs, mapServerContact(newContact)]);
      }
      closeModal();
    } catch (err) {
      setError(err.message || "Gagal menyimpan kontak");
    } finally {
      setLoading(false);
    }
  }, [authFetch, editTarget, form, closeModal]);

  const confirmDelete = useCallback((id) => setDeleteId(id), []);
  const cancelDelete = useCallback(() => setDeleteId(null), []);

  const deleteContactHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteContactApi(authFetch, deleteId);
      setContacts((cs) => cs.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err.message || "Gagal menghapus kontak");
    } finally {
      setLoading(false);
    }
  }, [authFetch, deleteId]);

  return {
    contacts,
    form,
    setField,
    showModal,
    openAdd,
    openEdit,
    closeModal,
    saveContact: saveContactHandler,
    deleteId,
    confirmDelete,
    cancelDelete,
    deleteContact: deleteContactHandler,
    isEditing: editTarget !== null,
    loading,
    error,
  };
}
