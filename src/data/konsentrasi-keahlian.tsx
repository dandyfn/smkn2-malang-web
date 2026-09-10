export interface Skill {
  nama: string;
  persen: number;
}

export interface KonsentrasiKeahlian {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  prospekUtama: string;
  skills: Skill[];
  mitra: string[];
  gambar: string;
}

export const DATA_KONSENTRASI: KonsentrasiKeahlian[] = [
  {
    id: "tjkt",
    kode: "TJKT",
    nama: "Teknik Jaringan Komputer & Telekomunikasi",
    kategori: "Teknologi Informasi",
    deskripsi:
      "Fokus pada penguasaan infrastruktur jaringan, administrasi server, keamanan siber, dan teknologi cloud berstandar industri.",
    prospekUtama: "Network Engineer & SysAdmin",
    skills: [
      { nama: "Network & Router Config", persen: 90 },
      { nama: "Server Admin & Cloud", persen: 85 },
      { nama: "Cyber Security Fundamentals", persen: 75 },
    ],
    mitra: ["PT Telkom Indonesia", "Cisco Academy", "MikroTik"],
    gambar: "/images/smkn2logo.png",
  },
  {
    id: "lk",
    kode: "LK",
    nama: "Layanan Kesehatan & Keperawatan",
    kategori: "Kesehatan",
    deskripsi:
      "Membekali siswa dengan kompetensi keperawatan dasar, perawatan lansia, pertolongan pertama, serta manajemen fasilitas kesehatan.",
    prospekUtama: "Asisten Tenaga Kesehatan",
    skills: [
      { nama: "Perawatan Pemenuhan Kebutuhan Dasar", persen: 95 },
      { nama: "Pemeriksaan Tanda Vital", persen: 90 },
      { nama: "Sterilisasi & Sanitasi Medis", persen: 80 },
    ],
    mitra: ["RSUD Dr. Saiful Anwar", "RSI Unisma", "Puskesmas Malang"],
    gambar: "/images/smkn2logo.png",
  },
  {
    id: "kuliner",
    kode: "KL",
    nama: "Kuliner / Tata Boga",
    kategori: "Pariwisata & Seni",
    deskripsi:
      "Mengembangkan keahlian pengolahan makanan Nusantara dan Internasional, manajemen tata hidang, serta kewirausahaan di bidang kuliner.",
    prospekUtama: "Junior Chef & F&B Entrepreneur",
    skills: [
      { nama: "Pengolahan Makanan & Pastry", persen: 90 },
      { nama: "Sanitasi & Keamanan Pangan (HACCP)", persen: 85 },
      { nama: "Food Plating & Presentation", persen: 80 },
    ],
    mitra: ["Hotel Santika Premier", "The Singhasari Resort", "Atria Hotel"],
    gambar: "/images/smkn2logo.png",
  },
  {
    id: "ph",
    kode: "PH",
    nama: "Perhotelan",
    kategori: "Pariwisata",
    deskripsi:
      "Mendidik tenaga profesional di bidang front office, housekeeping, dan manajemen layanan tamu berstandar industri perhotelan bintang 5.",
    prospekUtama: "Front Desk Officer & Housekeeping",
    skills: [
      { nama: "Front Office & Reservation", persen: 90 },
      { nama: "Housekeeping & Laundry Ops", persen: 88 },
      { nama: "Public Relation & Hospitality", persen: 85 },
    ],
    mitra: ["Grand Mercure Malang", "Hotel Shalimar", "Harris Hotel"],
    gambar: "/images/smkn2logo.png",
  },
];