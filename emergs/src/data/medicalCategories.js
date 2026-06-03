/**
 * data/medicalCategories.js
 * Medical history categories with their entries.
 * iconName refers to a lucide-react icon — resolved in the component.
 */

export const MEDICAL_CATEGORIES = [
  {
    id:       "penyakit",
    iconName: "Stethoscope",
    label:    "Riwayat Penyakit",
    desc:     "Daftar diagnosis dan rekam medis",
    badge:    "8 Entri",
    entries:  [
      { date: "12 Mar 2024", title: "ISPA",       note: "Antibiotik 5 hari, istirahat penuh"           },
      { date: "07 Nov 2023", title: "Hipertensi", note: "Tekanan darah 140/90, resep Amlodipine"       },
      { date: "22 Jun 2023", title: "Tifoid",     note: "Rawat inap 4 hari, RS Soetomo"               },
    ],
  },
  {
    id:       "alergi",
    iconName: "AlertTriangle",
    label:    "Riwayat Alergi",
    desc:     "Obat, makanan, dan zat pemicu alergi",
    badge:    "3 Item",
    entries:  [
      { date: "—", title: "Penisilin",    note: "Reaksi anafilaksis, hindari total" },
      { date: "—", title: "Kacang tanah", note: "Urtikaria, bawa EpiPen"            },
      { date: "—", title: "Debu rumah",   note: "Rhinitis alergi, gunakan antihistamin" },
    ],
  },
  {
    id:       "obat",
    iconName: "Pill",
    label:    "Riwayat Obat",
    desc:     "Obat yang pernah / sedang dikonsumsi",
    badge:    "5 Item",
    entries:  [
      { date: "Aktif",   title: "Amlodipine 5mg", note: "1×1 malam, untuk hipertensi"    },
      { date: "Selesai", title: "Amoxicillin",    note: "3×1 selama 7 hari (ISPA)"       },
      { date: "Selesai", title: "Paracetamol",    note: "3×1 jika demam"                 },
    ],
  },
  {
    id:       "catatan",
    iconName: "NotebookPen",
    label:    "Catatan Medis",
    desc:     "Catatan dokter dan instruksi khusus",
    badge:    "4 Catatan",
    entries:  [
      { date: "10 Apr 2024", title: "Kontrol Rutin",     note: "Jadwal kontrol hipertensi tiap 3 bulan"    },
      { date: "01 Jan 2024", title: "Diet Rendah Garam", note: "Maks 2g garam per hari per anjuran dokter" },
    ],
  },
];
