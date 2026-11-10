// Data halaman profil KADOEA Senior Living (/kadoea)
// - Kontak, statistik, dan fasilitas: diedit langsung di file ini.
// - Paket, FAQ, dan ulasan: dikelola lewat panel admin (/admin/kadoea) dan disimpan di Supabase.
//   Isi KADOEA_PAKET, KADOEA_FAQ, dan KADOEA_ULASAN di bawah hanya CADANGAN yang dipakai
//   bila tabel Supabase belum dibuat atau koneksi gagal.
// Bagian bertanda TODO wajib dicek ke pengelola KADOEA sebelum dipublikasikan.

export const KADOEA_KONTAK = {
  nama: "KADOEA Senior Living Samuphahita",
  alamat: "Jl. Veteran No.17, Ketawanggede, Kec. Lowokwaru, Kota Malang, Jawa Timur 65145",
  telepon: "(0341) 551504",
  teleponLink: "tel:+62341551504",
  // TODO: isi nomor WhatsApp reservasi (format 62xxxxxxxxxx). Kosongkan jika belum ada,
  // tombol WhatsApp otomatis disembunyikan.
  whatsapp: "",
  // TODO: isi email resmi KADOEA jika ada
  email: "",
  web: "smkn2malang.sch.id/kadoea",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=KADOEA%20Senior%20Living%20Samuphahita%20Malang",
};

// Angka di bagian "Tentang". Sumber: berita peresmian TIMES Indonesia, 24 November 2021.
export const KADOEA_STATISTIK = [
  { angka: "10", label: "Kamar tersedia" },
  { angka: "9", label: "Kamar standar" },
  { angka: "1", label: "Kamar total care" },
  { angka: "2021", label: "Diresmikan" },
];

export type Paket = {
  nama: string;
  ringkas: string;
  harga: string;
  satuan: string;
  fitur: string[];
  unggulan?: boolean;
};

// TODO: nama paket, harga, dan isi layanan di bawah adalah CONTOH susunan.
// Ganti dengan daftar paket dan tarif resmi dari pengelola KADOEA.
export const KADOEA_PAKET: Paket[] = [
  {
    nama: "Menginap Harian",
    ringkas: "Untuk lansia yang perlu tempat tinggal sementara, misalnya saat keluarga bepergian.",
    harga: "Hubungi kami",
    satuan: "per malam",
    fitur: ["Kamar standar dengan kamar mandi dalam", "Makan 3 kali sehari", "Pendampingan caregiver", "Pemantauan kondisi harian"],
  },
  {
    nama: "Tinggal Bulanan",
    ringkas: "Layanan tinggal jangka panjang dengan suasana hotel, bukan panti.",
    harga: "Hubungi kami",
    satuan: "per bulan",
    fitur: ["Semua layanan paket harian", "Kegiatan rekreasi dan senam lansia", "Laporan perkembangan untuk keluarga", "Laundry pakaian"],
    unggulan: true,
  },
  {
    nama: "Total Care",
    ringkas: "Untuk lansia yang membutuhkan bantuan penuh dalam aktivitas sehari-hari.",
    harga: "Hubungi kami",
    satuan: "per bulan",
    fitur: ["Kamar khusus total care", "Bantuan mandi, makan, dan mobilisasi", "Pendampingan lebih intensif", "Koordinasi dengan tenaga kesehatan"],
  },
];

export type Fasilitas = {
  ikon: "bed" | "heart" | "utensils" | "users" | "shield" | "trees" | "sparkles" | "phone";
  nama: string;
  deskripsi: string;
  foto: string; // foto latar slide, dari folder public/
};

// Kamar dan pendampingan sesuai berita peresmian. TODO: cek fasilitas lainnya ke pengelola.
// TODO: foto di bawah masih memakai foto yang ada di proyek. Ganti dengan foto asli KADOEA
//       (taruh di public/images/kadoea/ lalu ubah path-nya, misalnya "/images/kadoea/kamar.jpg").
export const KADOEA_FASILITAS: Fasilitas[] = [
  { ikon: "bed", nama: "Kamar Nyaman", deskripsi: "Sembilan kamar standar bernuansa hotel yang bersih, tenang, dan nyaman untuk beristirahat.", foto: "/images/pht.jpg" },
  { ikon: "heart", nama: "Kamar Total Care", deskripsi: "1 kamar khusus untuk lansia dengan kebutuhan perawatan penuh.", foto: "/images/fasilitaskesehatan.jpg" },
  { ikon: "users", nama: "Caregiver Terlatih", deskripsi: "Didampingi caregiver bersama siswa konsentrasi LPKC SMKN 2 Malang.", foto: "/images/lpkc.jpg" },
  { ikon: "utensils", nama: "Menu Bergizi", deskripsi: "Hidangan disiapkan sesuai kebutuhan gizi lansia.", foto: "/images/kl.jpg" },
  { ikon: "trees", nama: "Ruang Bersantai", deskripsi: "Area bersama untuk berbincang, membaca, dan beraktivitas ringan.", foto: "/images/perpustakaan.jpg" },
  { ikon: "shield", nama: "Lingkungan Aman", deskripsi: "Berada di lingkungan sekolah dengan akses yang terjaga.", foto: "/images/keamanan.jpg" },
];

export const KADOEA_FAQ = [
  {
    q: "Apakah KADOEA Senior Living sama dengan panti jompo?",
    a: "Bukan. KADOEA adalah hotel khusus lansia. Layanannya seperti hotel, dengan tambahan pendampingan bagi tamu lanjut usia.",
  },
  {
    q: "Berapa jumlah kamar yang tersedia?",
    a: "Tersedia 10 kamar, terdiri dari 9 kamar standar dan 1 kamar total care untuk lansia yang membutuhkan perawatan penuh.",
  },
  {
    q: "Siapa yang mendampingi para lansia?",
    a: "Tamu didampingi caregiver. KADOEA juga menjadi tempat teaching factory bagi siswa SMK Negeri 2 Malang, sehingga siswa ikut melayani di bawah bimbingan pendamping.",
  },
  {
    q: "Bagaimana cara melakukan reservasi?",
    a: `Hubungi kami melalui telepon ${KADOEA_KONTAK.telepon}. Tim kami akan membantu memilih paket yang sesuai dengan kebutuhan lansia dan keluarga.`,
  },
  {
    q: "Apakah keluarga boleh berkunjung?",
    // TODO: sesuaikan dengan aturan jam kunjung KADOEA
    a: "Keluarga dapat berkunjung pada jam kunjung yang telah ditentukan. Silakan hubungi kami untuk informasi jadwal kunjungan.",
  },
];

export type Ulasan = {
  nama: string; rating: number; isi: string; waktu?: string; profileUrl?: string;
  sumber?: "google" | "pengunjung";
  /** Balasan admin KADOEA untuk ulasan pengunjung */
  balasan?: string;
};

// Isi dengan ulasan ASLI dari Google Maps (salin nama, rating, dan isinya).
// Contoh format:
// { nama: "Nama Pengulas", rating: 5, isi: "Isi ulasan...", waktu: "2 bulan lalu" },
// Selama daftar ini kosong, bagian ulasan menampilkan ajakan untuk membaca ulasan di Google Maps.
export const KADOEA_ULASAN: Ulasan[] = [];
