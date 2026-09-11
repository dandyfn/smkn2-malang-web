export interface KonsentrasiKeahlian {
  id: string;
  singkatan: string;
  nama: string;
  deskripsi: string;
  prospekUtama: string;
  toolsAndSkills: string[];
  gambar: string;
  // DATA DETAIL TAMBAHAN
  materiPembelajaran: string[];
  peluangKarier: string[];
  fasilitasLab: string[];
}

export const DATA_KONSENTRASI: KonsentrasiKeahlian[] = [
  {
    id: "ps",
    singkatan: "PS",
    nama: "Pekerjaan Sosial",
    deskripsi:
      "Membentuk tenaga profesional yang peka terhadap dinamika sosial. Peserta didik dibekali keterampilan pendampingan masyarakat, rehabilitasi sosial, dan manajemen penyelesaian masalah untuk siap berdedikasi di lembaga sosial pemerintah maupun NGO swasta.",
    prospekUtama: "Pekerja Sosial & Worker Community",
    toolsAndSkills: ["Case Management", "Assesment Sosial", "Pendampingan Komunitas", "Communication Skill"],
    gambar: "/images/smkn2logo.png",
    materiPembelajaran: [
      "Dasar-Dasar Pekerjaan Sosial",
      "Teknik Pendampingan Komunitas & Keluarga",
      "Rehabilitasi Sosial & Etika Pelayanan",
      "Manajemen Konflik & Komunikasi Sosial",
    ],
    peluangKarier: [
      "Pendamping Sosial Kemensos / Dinas Sosial",
      "Staf NGO / Lembaga Swadaya Masyarakat (LSM)",
      "Konselor Komunitas & Panti Sosial",
      "Facilitator Program CSR Perusahaan",
    ],
    fasilitasLab: [
      "Laboratorium Simulasi Konseling",
      "Ruang Diskusi & Assesment Kasus",
      "Studio Dokumentasi Kegiatan Sosial",
    ],
  },
  {
    id: "pht",
    singkatan: "PHT",
    nama: "Perhotelan",
    deskripsi:
      "Mengasah keterampilan hospitality yang komprehensif, mencakup front office, housekeeping, hingga manajemen operasional. Lulusan disiapkan menjadi tenaga profesional yang mampu memberikan layanan berstandar hotel berbintang kepada tamu dari berbagai belahan dunia.",
    prospekUtama: "Front Desk & Housekeeping Officer",
    toolsAndSkills: ["Front Office System", "Housekeeping Ops", "Guest Relation", "Hospitality Service"],
    gambar: "/images/smkn2logo.png",
    materiPembelajaran: [
      "Operasional Front Office & Property Management System",
      "Housekeeping & Laundry Operations",
      "Komunikasi Bisnis & Bahasa Inggris Pariwisata",
      "Etika Penampilan & Guest Relation Management",
    ],
    peluangKarier: [
      "Front Desk Agent Hotel Berbintang",
      "Housekeeping Supervisor",
      "Guest Relation Officer (GRO)",
      "Staf Operasional Kapal Pesiar",
    ],
    fasilitasLab: [
      "Edutel (Hotel Praktik Standar Bintang)",
      "Mockup Room & Front Desk Counter",
      "Laundry Practical Room",
    ],
  },
  {
    id: "lpkc",
    singkatan: "LPKC",
    nama: "Layanan Penunjang Keperawatan dan Caregiving",
    deskripsi:
      "Mencetak asisten keperawatan dan caregiver yang terampil, sabar, dan beretika tinggi. Peserta didik menguasai ilmu kesehatan dasar dan teknik pendampingan pasien/lansia untuk siap berkarir di rumah sakit, klinik kesehatan, maupun layanan home care.",
    prospekUtama: "Asisten Keperawatan & Caregiver",
    toolsAndSkills: ["Tanda Vital & CPR", "Caregiving & Eldercare", "Sterilisasi Medis", "Etika Keperawatan"],
    gambar: "/images/smkn2logo.png",
    materiPembelajaran: [
      "Kebutuhan Dasar Manusia & Keperawatan Dasar",
      "Anatomi Fisiologi & Farmakologi Dasar",
      "Perawatan Lansia (Eldercare) & Anak",
      "Pertolongan Pertama pada Kecelakaan (P3K)",
    ],
    peluangKarier: [
      "Asisten Keperawatan Rumah Sakit / Klinik",
      "Professional Caregiver Home Care",
      "Asisten Tenaga Medis Panti Wredha",
      "Tenaga Keperawatan Internasional (Jepang/Jerman)",
    ],
    fasilitasLab: [
      "Laboratorium Keperawatan Standar Rumah Sakit",
      "Peralatan Medis & Manekin Simulasi Pasien",
      "Ruang Praktik Caregiving & Lansia",
    ],
  },
  {
    id: "ulw",
    singkatan: "ULW",
    nama: "Usaha Layanan Wisata",
    deskripsi:
      "Menyiapkan ahli pariwisata yang kompeten dalam merancang paket perjalanan, manajemen ticketing, dan pemanduan wisata (tour guiding). Kami mencetak lulusan yang siap menjadi penggerak industri pariwisata lokal hingga internasional dengan standar pelayanan prima.",
    prospekUtama: "Tour Planner & Travel Consultant",
    toolsAndSkills: ["Tour Guiding", "Ticketing System", "Itinerary Planning", "Public Speaking"],
    gambar: "/images/smkn2logo.png",
    materiPembelajaran: [
      "Perencanaan Paket Wisata & Guiding Technique",
      "Reservasi & Ticketing Penerbangan/Kereta",
      "Pengelolaan Event / MICE (Meeting, Incentive, Convention, Exhibition)",
      "Geografi Pariwisata & Pemasaran Digital Travel",
    ],
    peluangKarier: [
      "Tour Planner / Travel Consultant",
      "Tour Guide Profesional",
      "Event Organizer (EO) Specialist",
      "Staf Ticketing Agent & Maskapai",
    ],
    fasilitasLab: [
      "Travel Agency Simulation Counter",
      "Studio Lab Guiding & Mockup Bus",
      "Komputer System Ticketing (GDS)",
    ],
  },
  {
    id: "kl",
    singkatan: "KL",
    nama: "Kuliner",
    deskripsi:
      "Mengembangkan keahlian tata boga dari pengolahan makanan nusantara hingga kontinental. Siswa dilatih menguasai standar kebersihan (sanitation & hygiene), kreativitas penyajian, serta jiwa kewirausahaan unggul untuk industri restoran, perhotelan, dan katering.",
    prospekUtama: "Junior Chef & F&B Entrepreneur",
    toolsAndSkills: ["Indonesian & Western Cuisine", "Pastry & Bakery", "Food Safety (HACCP)", "Food Plating"],
    gambar: "/images/smkn2logo.png",
    materiPembelajaran: [
      "Pengolahan Makanan Nusantara & Kontinental",
      "Pastry, Bakery, & Decoration Art",
      "Sanitasi, Hygiene, dan Keamanan Pangan",
      "Manajemen Operasional Restoran & Cost Control",
    ],
    peluangKarier: [
      "Junior Chef Restoran / Hotel",
      "Pastry & Bakery Baker",
      "Wirausaha Catering & Culinary Art",
      "F&B Service Specialist",
    ],
    fasilitasLab: [
      "Kitchen Laboratory Standar Industri",
      "Pastry & Bakery Studio",
      "Restoran Praktik (Dining Area)",
    ],
  },
  {
    id: "tkj",
    singkatan: "TKJ",
    nama: "Teknik Komputer dan Jaringan",
    deskripsi:
      "Membekali siswa dengan kompetensi perakitan komputer, konfigurasi jaringan (LAN/WAN), hingga manajemen server dan keamanan data. Lulusan disiapkan untuk langsung menjawab tantangan era digital sebagai administrator jaringan dan teknisi IT yang andal.",
    prospekUtama: "Network Engineer & System Admin",
    toolsAndSkills: ["Cisco & Router Config", "Server Administration", "Network Security", "Fiber Optic"],
    gambar: "/images/smkn2logo.png",
    materiPembelajaran: [
      "Administrasi Infrastruktur Jaringan (Cisco/MikroTik)",
      "Administrasi Sistem Server (Linux & Windows Server)",
      "Teknologi Jaringan Kabel & Fiber Optic",
      "Dasar Keamanan Siber (Cyber Security)",
    ],
    peluangKarier: [
      "Network Engineer / Network Administrator",
      "System Administrator & Cloud Ops",
      "Teknisi Jaringan & Fiber Optic Specialist",
      "IT Technical Support",
    ],
    fasilitasLab: [
      "Lab Jaringan Cisco & MikroTik",
      "Server Room & Cloud Lab",
      "Lab Perakitan Computer & Fiber Optic Splicing",
    ],
  },
];