export interface Ekstrakurikuler {
  id: string;
  nama: string;
  slug: string;
  kategori: "Olahraga" | "Seni & Budaya" | "Keagamaan" | "Kebahasaan & Sains" | "Belanegara & Sosial";
  hari: string[];
  lokasi: string;
  pembina: string;
  kontak: string;
  deskripsi: string;
  programKerja: string[];
  galeri: {
    foto: string;
    caption: string;
    rotasi: string; // Efek kemiringan kertas klip foto (-rotate-2, rotate-2, dsb)
  }[];
}

export const DATA_EKSTRAKURIKULER: Ekstrakurikuler[] = [
  // SENIN
  {
    id: "pencak-silat",
    nama: "Pencak Silat (Pagar Nusa)",
    slug: "pencak-silat",
    kategori: "Belanegara & Sosial",
    hari: ["Senin"],
    lokasi: "Lapangan Indoor",
    pembina: "Ria Devi Nuryana, S.Pd",
    kontak: "085806019531",
    deskripsi: "Wadah olah raga dan olah jiwa melalui seni bela diri tradisional Indonesia untuk membentuk mental, kedisiplinan, serta karakter kepemimpinan siswa.",
    programKerja: [
      "Latihan fisik dan teknik dasar silat",
      "Ujian kenaikan tingkat sabuk",
      "Partisipasi kejuaraan silat antar pelajar"
    ],
    galeri: [
      { foto: "/images/ekskul/silat-1.jpg", caption: "Latihan Jurus Dasar", rotasi: "-rotate-2" },
      { foto: "/images/ekskul/silat-2.jpg", caption: "Ujian Kenaikan Sabuk", rotasi: "rotate-3" },
      { foto: "/images/ekskul/silat-3.jpg", caption: "Kontingen Kejuaraan", rotasi: "-rotate-1" },
    ]
  },
  {
    id: "vocal-grup",
    nama: "Vocal Grup",
    slug: "vocal-grup",
    kategori: "Seni & Budaya",
    hari: ["Senin"],
    lokasi: "Kelas A.203",
    pembina: "Neni Triwidayanti, S.Pd, Gr",
    kontak: "081246028620",
    deskripsi: "Mengembangkan olah vokal, harmonisasi suara, dan rasa percaya diri dalam bernyanyi secara kelompok dengan berbagai genre musik.",
    programKerja: [
      "Latihan teknik pernapasan & aransemen lagu",
      "Pentas seni tahunan sekolah",
      "Pengisian acara seremoni resmi sekolah"
    ],
    galeri: [
      { foto: "/images/ekskul/vocal-1.jpg", caption: "Harmonisasi Suara", rotasi: "rotate-2" },
      { foto: "/images/ekskul/vocal-2.jpg", caption: "Tampil di Wisuda", rotasi: "-rotate-3" }
    ]
  },
  // SELASA
  {
    id: "pramuka",
    nama: "Pramuka",
    slug: "pramuka",
    kategori: "Belanegara & Sosial",
    hari: ["Selasa"],
    lokasi: "Lapangan Indoor",
    pembina: "Fina Ristanti, S.Pd, Gr",
    kontak: "0895607998149",
    deskripsi: "Ekstrakurikuler wajib yang membina karakter mandiri, kecintaan alam, keterampilan survival, serta kepemimpinan generasi muda.",
    programKerja: [
      "Penerimaan Tamu Ambalan",
      "Kemah Blok & Perkemahan Akhir Tahun",
      "Pelatihan Navigasi Darat & P3K"
    ],
    galeri: [
      { foto: "/images/ekskul/pramuka-1.jpg", caption: "Upacara Pembukaan", rotasi: "-rotate-2" },
      { foto: "/images/ekskul/pramuka-2.jpg", caption: "Malam Api Unggun", rotasi: "rotate-2" },
      { foto: "/images/ekskul/pramuka-3.jpg", caption: "Lomba Pionering", rotasi: "-rotate-1" }
    ]
  },
  {
    id: "futsal",
    nama: "Futsal",
    slug: "futsal",
    kategori: "Olahraga",
    hari: ["Selasa"],
    lokasi: "SM Futsal",
    pembina: "Ria Devi Nuryana, S.Pd",
    kontak: "085806019531",
    deskripsi: "Mengasah ketangkasan fisik, taktik permainan tim, serta sportifitas tinggi dalam cabang olahraga futsal.",
    programKerja: [
      "Latihan fisik & penyusunan strategi tim",
      "Sparring rutin antar sekolah",
      "Mengikuti turnamen futsal tingkat pelajar"
    ],
    galeri: [
      { foto: "/images/ekskul/futsal-1.jpg", caption: "Latihan Taktik Tim", rotasi: "rotate-1" },
      { foto: "/images/ekskul/futsal-2.jpg", caption: "Laga Persahabatan", rotasi: "-rotate-2" }
    ]
  },
  {
    id: "bdi",
    nama: "Badan Dakwah Islam (BDI)",
    slug: "bdi",
    kategori: "Keagamaan",
    hari: ["Selasa"],
    lokasi: "Kelas P.105",
    pembina: "Istiqomah, S.Pd, Gr",
    kontak: "0895602917117",
    deskripsi: "Wadah pembinaan rohani Islam untuk memperdalam pemahaman agama, kepemimpinan Islam, serta kegiatan sosial kemasyarakatan.",
    programKerja: [
      "Kajian rutin mingguan",
      "Peringatan Hari Besar Islam (PHBI)",
      "Bakti sosial dan pesantren kilat"
    ],
    galeri: [
      { foto: "/images/ekskul/bdi-1.jpg", caption: "Kajian Rutin", rotasi: "-rotate-3" },
      { foto: "/images/ekskul/bdi-2.jpg", caption: "Peringatan Isra Miraj", rotasi: "rotate-2" }
    ]
  },
  // RABU
  {
    id: "seni-tari",
    nama: "Seni Tari",
    slug: "seni-tari",
    kategori: "Seni & Budaya",
    hari: ["Rabu"],
    lokasi: "Kelas A.205",
    pembina: "Neni Triwidayanti, S.Pd, Gr",
    kontak: "081246028620",
    deskripsi: "Melestarikan kekayaan budaya lewat eksplorasi gerak tari tradisional Nusantara hingga tari kreasi modern.",
    programKerja: [
      "Latihan koreografi tari daerah khas Jatim",
      "Pentas seni & pelepasan wisudawan",
      "Keikutsertaan dalam festival seni tari"
    ],
    galeri: [
      { foto: "/images/ekskul/tari-1.jpg", caption: "Latihan Koreografi", rotasi: "-rotate-2" },
      { foto: "/images/ekskul/tari-2.jpg", caption: "Tampil di Malang Festival", rotasi: "rotate-3" },
      { foto: "/images/ekskul/tari-3.jpg", caption: "Kostum Tari Tradisional", rotasi: "-rotate-1" }
    ]
  },
  {
    id: "bola-basket",
    nama: "Bola Basket",
    slug: "bola-basket",
    kategori: "Olahraga",
    hari: ["Senin", "Rabu"],
    lokasi: "Lapangan Indoor",
    pembina: "Ria Devi Nuryana, S.Pd",
    kontak: "085806019531",
    deskripsi: "Mengembangkan kemampuan olah bola, stamina, kerjasama tim, serta mental bertanding di lapangan basket.",
    programKerja: [
      "Fundamental dribble, shooting, & defense",
      "Tryout kompetisi liga basket pelajar",
      "Latihan fisik intensif"
    ],
    galeri: [
      { foto: "/images/ekskul/basket-1.jpg", caption: "Drill Layup", rotasi: "rotate-2" },
      { foto: "/images/ekskul/basket-2.jpg", caption: "Kompetisi DBL", rotasi: "-rotate-2" }
    ]
  },
  // KAMIS
  {
    id: "entrepreneur",
    nama: "Entrepreneur",
    slug: "entrepreneur",
    kategori: "Kebahasaan & Sains",
    hari: ["Kamis"],
    lokasi: "Area Kantin",
    pembina: "Binti Sholekha, S.Pd I",
    kontak: "081317870613",
    deskripsi: "Membangun jiwa kewirausahaan, pemikiran bisnis kreatif, strategi pemasaran, dan pembuatan produk bernilai jual bagi siswa.",
    programKerja: [
      "Praktik Bazar & Business Day",
      "Workshop Digital Marketing",
      "Kunjungan ke UMKM Lokal"
    ],
    galeri: [
      { foto: "/images/ekskul/bisnis-1.jpg", caption: "Pameran Produk Produk Siswa", rotasi: "-rotate-2" },
      { foto: "/images/ekskul/bisnis-2.jpg", caption: "Praktik Penjualan", rotasi: "rotate-2" }
    ]
  },
  {
    id: "multimedia",
    nama: "Multimedia",
    slug: "multimedia",
    kategori: "Kebahasaan & Sains",
    hari: ["Kamis"],
    lokasi: "Kelas A.201",
    pembina: "Binti Sholekha, S.Pd I",
    kontak: "081317870613",
    deskripsi: "Wadah eksplorasi dunia desain grafis, fotografi, videografi, serta editing konten kreatif berbasis teknologi.",
    programKerja: [
      "Pelatihan Desain Grafis & UI/UX",
      "Hunting Fotografi & Videografi",
      "Produksi Konten Dokumentasi Sekolah"
    ],
    galeri: [
      { foto: "/images/ekskul/mm-1.jpg", caption: "Hunting Foto Dokumentasi", rotasi: "rotate-1" },
      { foto: "/images/ekskul/mm-2.jpg", caption: "Sesi Editing Video", rotasi: "-rotate-3" }
    ]
  },
  // JUMAT & SABTU
  {
    id: "badminton",
    nama: "Bulu Tangkis (Badminton)",
    slug: "badminton",
    kategori: "Olahraga",
    hari: ["Jumat", "Sabtu"],
    lokasi: "Hall SC Bandulan gg.8 (Jumat) / Balai RW Sumbersari (Sabtu)",
    pembina: "Ria Devi Nuryana, S.Pd",
    kontak: "085806019531",
    deskripsi: "Melatih keahlian mengolah raket, refleks, strategi permainan tunggal dan ganda dalam cabang badminton.",
    programKerja: [
      "Latihan teknik footwork & stroke",
      "Internal Tournament SMKN 2 Malang",
      "Pertandingan persahabatan"
    ],
    galeri: [
      { foto: "/images/ekskul/badminton-1.jpg", caption: "Latihan Smash & Footwork", rotasi: "-rotate-2" },
      { foto: "/images/ekskul/badminton-2.jpg", caption: "Pertandingan Ganda", rotasi: "rotate-2" }
    ]
  }
];