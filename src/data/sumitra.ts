// Data cadangan halaman /sumitra (dipakai bila tabel Supabase belum dibuat atau gagal dibaca)
// serta tipe dan fungsi bantu yang dipakai bersama halaman publik dan panel admin.
// Isi berasal dari wawancara dengan Pak Roy (pengelola Sumitra Kelana Wisata).

export type JenisPaket = "open_trip" | "private_trip" | "internasional";
export type IkonLayanan = "pemandu" | "mobil" | "pesawat" | "tiket" | "trail" | "kereta";
export type FieldWa = "tanggal" | "jumlah" | "lokasi" | "lama" | "bayar";

export type Paket = {
  id: string | null;
  slug: string;
  jenis: JenisPaket;
  nama: string;
  ringkasan: string;
  durasi: string;
  jadwal: string;
  hargaMulai: number | null;
  satuanHarga: string;
  catatanHarga: string;
  termasuk: string[];
  susunanAcara: string[];
  fotoUrl: string | null;
};

export type Layanan = {
  id: string | null;
  nama: string;
  ikon: IkonLayanan;
  deskripsi: string;
  hargaMulai: number | null;
  satuanHarga: string;
  labelHarga: string;
  fieldWa: FieldWa[];
};

export type GaleriItem = { id: string; fotoUrl: string; keterangan: string };
export type Testimoni = {
  id: string; nama: string; perjalanan: string; rating: number; isi: string; fotoUrl: string | null; balasan: string | null;
};
export type FaqItem = { q: string; a: string };
export type Mitra = { id: string; nama: string; logoUrl: string | null };

export type Pengaturan = {
  nomorWa: string;
  instagram: string;
  facebook: string;
  jamBuka: string;
  besaranDp: string;
  aturanTambahan: string[];
  logoUrl: string | null;
  heroFotoUrl: string | null;
  tentangFotoUrl: string | null;
};

export const SUMITRA = {
  nama: "Sumitra Kelana Wisata",
  slogan: "Having fun trip with us",
  berdiri: 2012,
  alamat: "Edotel SMKN 2 Malang, Jl. Veteran No. 17, Ketawanggede, Lowokwaru, Kota Malang, Jawa Timur 65145",
  alamatSingkat: "Edotel SMKN 2 Malang, Jl. Veteran No. 17, Malang",
  mapsUrl: "https://maps.google.com/?q=SMK+Negeri+2+Malang",
  /** Foto hero bawaan, dipakai selama admin belum mengunggah foto hero sendiri */
  heroBawaan: "/images/sumitra/hero-bromo.jpg",
  /** Foto section Tentang bawaan (rombongan peserta di Bromo) */
  tentangBawaan: "/images/sumitra/tentang.jpg",
};

export const JENIS_PAKET: { id: JenisPaket; label: string }[] = [
  { id: "open_trip", label: "Open Trip" },
  { id: "private_trip", label: "Private Trip" },
  { id: "internasional", label: "Internasional" },
];

export const LABEL_JENIS: Record<JenisPaket, string> = {
  open_trip: "OPEN TRIP",
  private_trip: "PRIVATE TRIP",
  internasional: "INTERNASIONAL",
};

export const PILIHAN_IKON: { id: IkonLayanan; label: string }[] = [
  { id: "pemandu", label: "Pemandu" },
  { id: "mobil", label: "Mobil" },
  { id: "pesawat", label: "Pesawat" },
  { id: "tiket", label: "Tiket" },
  { id: "trail", label: "Motor trail" },
  { id: "kereta", label: "Kereta" },
];

export const PILIHAN_FIELD: { id: FieldWa; label: string }[] = [
  { id: "tanggal", label: "Tanggal" },
  { id: "jumlah", label: "Jumlah orang" },
  { id: "lokasi", label: "Lokasi jemput" },
  { id: "lama", label: "Lama sewa" },
  { id: "bayar", label: "Cara bayar" },
];

// Isian formulir pemesanan paket wisata
export const FIELD_PAKET: FieldWa[] = ["tanggal", "jumlah", "bayar"];

export const SUMITRA_PENGATURAN: Pengaturan = {
  nomorWa: "6285854153750",
  instagram: "https://www.instagram.com/sumitrakelana",
  facebook: "https://www.facebook.com/profile.php?id=100068734360328",
  jamBuka: "07.00 – 15.00 WIB",
  besaranDp: "",
  aturanTambahan: [],
  logoUrl: null,
  heroFotoUrl: null,
  tentangFotoUrl: null,
};

export const SUMITRA_PAKET: Paket[] = [
  {
    id: null, slug: "open-trip-bromo", jenis: "open_trip", nama: "Open Trip Bromo",
    ringkasan: "Bergabung bersama peserta lain menikmati matahari terbit di Gunung Bromo.",
    durasi: "", jadwal: "Berangkat hampir setiap hari", hargaMulai: 300000, satuanHarga: "orang", catatanHarga: "",
    termasuk: [], susunanAcara: [], fotoUrl: null,
  },
  {
    id: null, slug: "open-trip-tumpak-sewu", jenis: "open_trip", nama: "Open Trip Tumpak Sewu",
    ringkasan: "Menjelajah air terjun Tumpak Sewu bersama peserta lain.",
    durasi: "", jadwal: "", hargaMulai: null, satuanHarga: "orang", catatanHarga: "",
    termasuk: [], susunanAcara: [], fotoUrl: null,
  },
  {
    id: null, slug: "private-trip-bromo", jenis: "private_trip", nama: "Private Trip Bromo",
    ringkasan: "Perjalanan ke Bromo khusus untuk rombonganmu sendiri, jadwal bisa disesuaikan.",
    durasi: "", jadwal: "", hargaMulai: null, satuanHarga: "rombongan", catatanHarga: "",
    termasuk: [], susunanAcara: [], fotoUrl: null,
  },
  {
    id: null, slug: "tur-korea", jenis: "internasional", nama: "Tur Korea",
    ringkasan: "Paket tur Korea melalui konsorsium travel agency Indonesia.",
    durasi: "", jadwal: "", hargaMulai: 10000000, satuanHarga: "orang", catatanHarga: "Harga musim sepi (low season)",
    termasuk: ["Tiket pesawat", "Hotel", "Transportasi di Korea", "Pemandu wisata"], susunanAcara: [], fotoUrl: null,
  },
  {
    id: null, slug: "tur-jepang", jenis: "internasional", nama: "Tur Jepang",
    ringkasan: "Paket tur Jepang melalui konsorsium travel agency Indonesia.",
    durasi: "", jadwal: "", hargaMulai: 18000000, satuanHarga: "orang", catatanHarga: "Harga musim sepi (low season)",
    termasuk: ["Tiket pesawat", "Hotel", "Transportasi di Jepang", "Pemandu wisata"], susunanAcara: [], fotoUrl: null,
  },
];

export const SUMITRA_LAYANAN: Layanan[] = [
  {
    id: null, nama: "Pemandu Wisata", ikon: "pemandu",
    deskripsi: "Pemandu berbahasa Indonesia, Inggris, Mandarin, dan Jepang untuk tur di Jawa Timur.",
    hargaMulai: 500000, satuanHarga: "hari", labelHarga: "", fieldWa: ["tanggal", "jumlah", "lama"],
  },
  {
    id: null, nama: "Rent Car", ikon: "mobil",
    deskripsi: "Dua armada sendiri, ditambah armada mitra alumni saat ramai. Untuk keliling Malang dan Batu.",
    hargaMulai: 500000, satuanHarga: "", labelHarga: "", fieldWa: ["tanggal", "jumlah", "lama", "lokasi"],
  },
  {
    id: null, nama: "Shuttle Bandara", ikon: "pesawat",
    deskripsi: "Antar dan jemput ke bandara, misalnya Juanda. Bayar ke sopir atau lewat transfer.",
    hargaMulai: 150000, satuanHarga: "", labelHarga: "", fieldWa: ["tanggal", "jumlah", "lokasi", "bayar"],
  },
  {
    id: null, nama: "Tiket Pesawat & Kereta", ikon: "tiket",
    deskripsi: "Reservasi tiket pesawat dan kereta api (KAI) dibantu tim kami.",
    hargaMulai: null, satuanHarga: "", labelHarga: "Tanpa biaya layanan", fieldWa: ["tanggal", "jumlah"],
  },
  {
    id: null, nama: "Sewa Trail", ikon: "trail",
    deskripsi: "Motor trail untuk petualangan di kawasan Bromo.",
    hargaMulai: null, satuanHarga: "", labelHarga: "", fieldWa: ["tanggal", "jumlah", "lama"],
  },
];

export const SUMITRA_FAQ: FaqItem[] = [
  {
    q: "Bagaimana cara memesan paket?",
    a: "Buka paket pilihanmu, isi formulir pemesanan, lalu tekan \"Kirim pesanan via WhatsApp\". Admin Sumitra akan membalas dengan rincian pembayaran DP.",
  },
  {
    q: "Kalau batal ikut, apakah uang kembali?",
    a: "Untuk paket tur, uang yang sudah dibayarkan termasuk DP tidak dapat dikembalikan. Aturan lengkapnya tercantum di halaman setiap paket.",
  },
  { q: "Apakah ada biaya tambahan untuk pesan tiket pesawat atau kereta?", a: "Tidak ada biaya layanan tambahan." },
];

export const SUMITRA_MITRA: Mitra[] = [
  "Konsorsium Travel Agency Indonesia", "Raja Holiday Indonesia", "King Travel", "Akcaya", "Alumni penyedia rent car",
].map((nama, i) => ({ id: `m${i}`, nama, logoUrl: null }));

/* ---------------- Fungsi bantu ---------------- */

export function formatRupiah(n: number): string {
  if (n >= 1_000_000 && n % 1_000_000 === 0) return `Rp${n / 1_000_000} juta`;
  return "Rp" + n.toLocaleString("id-ID");
}

/** Teks harga untuk kartu, misalnya "Rp300.000 / orang". Null bila harga belum diisi. */
export function teksHarga(hargaMulai: number | null, satuan: string): string | null {
  if (hargaMulai == null) return null;
  return satuan ? `${formatRupiah(hargaMulai)} / ${satuan}` : formatRupiah(hargaMulai);
}

export function teksHargaLayanan(l: Pick<Layanan, "hargaMulai" | "satuanHarga" | "labelHarga">): string {
  if (l.labelHarga) return l.labelHarga;
  if (l.hargaMulai == null) return "Tanya harga";
  const dasar = teksHarga(l.hargaMulai, l.satuanHarga) ?? "";
  return l.satuanHarga ? dasar : `Mulai ${dasar}`;
}

/** Pecah teks per baris menjadi daftar (baris kosong dibuang). */
export function perBaris(teks: string | null | undefined): string[] {
  return (teks ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
}

/** Nomor WA untuk tautan wa.me: 0812... -> 62812..., buang spasi/tanda. */
export function nomorWaInternasional(nomor: string): string {
  const angka = nomor.replace(/[^0-9]/g, "");
  if (!angka) return "";
  if (angka.startsWith("0")) return "62" + angka.slice(1);
  return angka;
}

/** Tautan wa.me untuk tombol "Konsultasi via WhatsApp" biasa. */
export function tautanWa(nomor: string, teks = "Halo Sumitra Kelana Wisata, saya ingin bertanya."): string | null {
  const n = nomorWaInternasional(nomor);
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(teks)}` : null;
}

/** Daftar syarat pembayaran & pembatalan paket tur (dari wawancara + pengaturan admin). */
export function syaratPaket(p: Pick<Pengaturan, "besaranDp" | "aturanTambahan">): string[] {
  return [
    p.besaranDp
      ? `DP sebesar ${p.besaranDp} dibayar di awal untuk mengamankan tempat, termasuk untuk keberangkatan seminggu lagi.`
      : "DP dibayar di awal untuk mengamankan tempat, termasuk untuk keberangkatan seminggu lagi.",
    "Pelunasan paling lambat sebelum hari keberangkatan.",
    "Jika peserta batal, uang yang sudah dibayarkan, termasuk DP, tidak dapat dikembalikan.",
    ...p.aturanTambahan,
  ];
}

export function syaratLayanan(p: Pick<Pengaturan, "aturanTambahan">): string[] {
  return [
    "Rincian biaya dan cara pembayaran dikonfirmasi admin Sumitra lewat WhatsApp.",
    "Pemesanan dianggap pasti setelah pembayaran yang diminta admin diterima.",
    ...p.aturanTambahan,
  ];
}
