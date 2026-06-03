/**
 * pages/user/EmergencyContacts.jsx
 *
 * Displays the user's emergency contacts in a responsive grid.
 * Composes: PageHeader, ContactCard, Modal, Button, InputField, EmptyState.
 * State managed by hooks/useContacts.js.
 */

import { UserPlus, Users } from "lucide-react";

import PageHeader   from "../../components/common/PageHeader";
import ContactCard  from "../../components/user/ContactCard";
import Modal        from "../../components/common/Modal";
import Button       from "../../components/common/Button";
import InputField   from "../../components/common/InputField";
import EmptyState   from "../../components/common/EmptyState";
import { useContacts } from "../../hooks/useContacts";

export default function EmergencyContacts() {
  const {
    contacts,
    form,
    setField,
    showModal,
    openAdd,
    openEdit,
    closeModal,
    saveContact,
    deleteId,
    confirmDelete,
    cancelDelete,
    deleteContact,
    isEditing,
    loading,
    error,
  } = useContacts();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">

      {/* ── Page header ── */}
      <PageHeader
        title="Emergency Contacts"
        subtitle={`${contacts.length} kontak terdaftar`}
        actions={
          <Button
            variant="primary"
            iconLeft={<UserPlus className="w-4 h-4" />}
            onClick={openAdd}
          >
            Tambah Kontak
          </Button>
        }
      />

      {/* ── Contact grid ── */}
      {error && (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-accent/10 bg-accent/5 p-6 text-center text-text/70">
          Memuat kontak darurat...
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-accent" />}
          title="Belum ada kontak darurat"
          message="Tambahkan kontak darurat agar bisa dihubungi saat keadaan darurat."
          action={
            <Button
              variant="primary"
              iconLeft={<UserPlus className="w-4 h-4" />}
              onClick={openAdd}
            >
              Tambah Kontak
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={openEdit}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={isEditing ? "Edit Kontak" : "Tambah Kontak Baru"}
        size="md"
        footer={
          <Modal.Footer>
            <Button variant="outline" fullWidth onClick={closeModal}>
              Batal
            </Button>
            <Button variant="primary" fullWidth onClick={saveContact}>
              {isEditing ? "Simpan Perubahan" : "Tambahkan"}
            </Button>
          </Modal.Footer>
        }
      >
        <div className="space-y-4">
          <InputField
            label="Nama"
            name="nama"
            value={form.nama}
            onChange={setField("nama")}
            placeholder="Nama lengkap..."
            required
          />
          <InputField
            label="Nomor HP"
            name="hp"
            type="tel"
            value={form.hp}
            onChange={setField("hp")}
            placeholder="08xxxxxxxxxx"
            required
          />
          <InputField
            label="Hubungan"
            name="hubungan"
            value={form.hubungan}
            onChange={setField("hubungan")}
            placeholder="cth: Ibu, Dokter, Rumah Sakit..."
          />
          <InputField
            label="Prioritas"
            name="prioritas"
            type="select"
            value={form.prioritas}
            onChange={setField("prioritas")}
          >
            <option>Utama</option>
            <option>Medis</option>
            <option>Biasa</option>
          </InputField>
        </div>
      </Modal>

      {/* ── Delete confirmation ── */}
      <Modal.ConfirmDelete
        isOpen={Boolean(deleteId)}
        onClose={cancelDelete}
        onConfirm={deleteContact}
        title="Hapus Kontak?"
        message="Kontak ini akan dihapus permanen dan tidak bisa dikembalikan."
      />
    </div>
  );
}
