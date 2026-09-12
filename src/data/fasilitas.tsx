export interface FasilitasItem {
  id: string;
  nama: string;
  tagline: string;
  deskripsi: string;
  fiturUtama: string[];
  gambar: string;
}

export const DATA_FASILITAS: FasilitasItem[] = [
  {
    id: "perpustakaan",
    nama: "Perpustakaan",
    tagline: "Pusat Literasi & Sumber Belajar Digital",
    deskripsi:
      "Menyediakan ribuan koleksi buku fisik, jurnal digital, serta ruang baca yang nyaman dan kondusif untuk mendukung kegiatan akademik siswa.",
    fiturUtama: ["E-Library & Akses Internet", "Ruang Baca AC", "Koleksi Buku Lengkap"],
    gambar: "/images/perpustakaan.jpg",
  },
  {
    id: "kesehatan",
    nama: "Fasilitas Kesehatan",
    tagline: "Layanan Pertolongan Pertama & Tempat Istirahat Medis",
    deskripsi:
      "Ruang UKS yang dilengkapi dengan peralatan medis dasar, obat-obatan, serta tempat tidur penanganan awal bagi siswa yang membutuhkan penanganan kesehatan.",
    fiturUtama: ["Peralatan P3K Lengkap", "Tenaga / Tim Penjaga UKS", "Ruang Istirahat Nyaman"],
    gambar: "/images/fasilitaskesehatan.jpg",
  },
  {
    id: "olahraga",
    nama: "Fasilitas Olahraga",
    tagline: "Sarana Pembinaan Kebiasaan Hidup Sehat & Prestasi",
    deskripsi:
      "Lapangan serbaguna yang dapat digunakan untuk kegiatan olahraga basket, voli, futsal, serta kegiatan fisik siswa secara optimal.",
    fiturUtama: ["Lapangan Basket & Voli", "Peralatan Olahraga Lengkap", "Area Outdoor Luas"],
    gambar: "/images/fasilitasolahraga.jpg",
  },
  {
    id: "parkir",
    nama: "Fasilitas Parkir",
    tagline: "Area Parkir Teratur, Luas, dan Aman",
    deskripsi:
      "Lahan parkir kendaraan roda dua dan roda empat yang terorganisir dengan baik untuk kenyamanan seluruh warga sekolah.",
    fiturUtama: ["Sistem Parkir Teratur", "Kapasitas Luas", "Pengawasan Keamanan"],
    gambar: "/images/parkir.jpg",
  },
  {
    id: "umum",
    nama: "Fasilitas Umum",
    tagline: "Sarana Penunjang Kegiatan Harian Sekolah",
    deskripsi:
      "Meliputi toilet bersih berstandar sanitasi baik, tempat ibadah (masjid/mushola), serta ruang terbuka bersama untuk diskusi siswa.",
    fiturUtama: ["Mushola Bersih", "Toilet Terawat", "Ruang Terbuka Hijau"],
    gambar: "/images/fasum.jpg",
  },
  {
    id: "flora-fauna",
    nama: "Flora dan Fauna",
    tagline: "Lingkungan Asri & Lingkungan Belajar Hijau",
    deskripsi:
      "Taman sekolah yang dikelilingi pepohonan hijau, tanaman hias, serta ekosistem ramah lingkungan yang menciptakan suasana belajar yang sejuk.",
    fiturUtama: ["Taman Rindang", "Area Green School", "Zona Edukasi Lingkungan"],
    gambar: "/images/florafauna.jpg",
  },
  {
    id: "kantin",
    nama: "Kantin",
    tagline: "Pusat Kuliner Sehat & Higienis",
    deskripsi:
      "Kantin sekolah yang bersih dengan jajaran stan makanan berstandar kesehatan (sehat dan bergizi) serta ruang makan bersama yang luas.",
    fiturUtama: ["Menu Sehat & Terjangkau", "Area Makan Luas", "Pengawasan Sanitasi"],
    gambar: "/images/kantin.jpg",
  },
  {
    id: "keamanan",
    nama: "Keamanan",
    tagline: "Sistem Pengawasan Lingkungan 24 Jam",
    deskripsi:
      "Didukung oleh petugas keamanan (Satpam) profesional dan pos penjagaan yang siap menjaga ketertiban serta keamanan lingkungan sekolah.",
    fiturUtama: ["Pos Satpam 24/7", "Akses Masuk Terkontrol", "Lingkungan Aman & Tertib"],
    gambar: "/images/keamanan.jpg",
  },
];