export const EMERGENCY_CONTACTS = [
  {
    id:        1,
    nama:      "Budi Santoso",
    hp:        "08512345677",
    hubungan:  "Saudara kandung",
    prioritas: "Utama",
  },
  {
    id:        2,
    nama:      "Siti Rahayu",
    hp:        "08987654321",
    hubungan:  "Ibu",
    prioritas: "Utama",
  },
  {
    id:        3,
    nama:      "Dr. Hendra",
    hp:        "08111222333",
    hubungan:  "Dokter Pribadi",
    prioritas: "Medis",
  },
  {
    id:        4,
    nama:      "Andi Wijaya",
    hp:        "08555666777",
    hubungan:  "Teman dekat",
    prioritas: "Biasa",
  },
  {
    id:        5,
    nama:      "RS Soetomo IGD",
    hp:        "0315501078",
    hubungan:  "Rumah Sakit",
    prioritas: "Medis",
  },
];

/** Priority badge meta — shared by ContactCard & EmergencyContacts page */
export const PRIORITY_META = {
  Utama: {
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-700/50",
    dot:   "bg-emerald-400",
  },
  Medis: {
    color: "bg-blue-500/20 text-blue-300 border-blue-700/50",
    dot:   "bg-blue-400",
  },
  Biasa: {
    color: "bg-green-700/30 text-green-300 border-green-700/50",
    dot:   "bg-green-500",
  },
};

/** Emoji avatar per relationship type */
export const HUBUNGAN_EMOJI = {
  "Ibu":              "👩",
  "Ayah":             "👨",
  "Saudara kandung":  "👫",
  "Teman dekat":      "🤝",
  "Dokter Pribadi":   "🩺",
  "Rumah Sakit":      "🏥",
};
