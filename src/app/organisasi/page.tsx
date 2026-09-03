"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Search, 
  Mail, 
  Phone, 
  RefreshCw, 
  Briefcase, 
  Award,
  Users,
  Vote,
  ShieldCheck,
  Building2,
  HeartHandshake,
  User
} from "lucide-react";

// Data Guru & Staf SMKN 2 Malang
const DATA_GURU = [
  {
    id: 1,
    nama: "Drs. H. Hari Mulyono, M.Pd.",
    nip: "19680312 199403 1 005",
    jabatan: "Kepala Sekolah",
    kejuruan: "Manajerial Sekolah",
    email: "kepsek@smkn2malang.sch.id",
    kontak: "+62 812-3456-7890",
    foto: "/images/guru/hari-mulyono.jpg"
  },
  {
    id: 2,
    nama: "Drs. H. Suharto, M.Pd.",
    nip: "19710520 199802 1 002",
    jabatan: "Waka Kurikulum",
    kejuruan: "Teknik Komputer dan Jaringan",
    email: "suharto@smkn2malang.sch.id",
    kontak: "+62 813-9876-5432",
    foto: "/images/guru/suharto.jpg"
  },
  {
    id: 3,
    nama: "Siti Rahmah, S.Pd., M.T.",
    nip: "19750520 200012 2 002",
    jabatan: "Kepala Program Keahlian (Kaprog)",
    kejuruan: "Teknik Komputer dan Jaringan",
    email: "siti.rahmah@smkn2malang.sch.id",
    kontak: "+62 813-1122-3344",
    foto: "/images/guru/siti-rahmah.jpg"
  },
  {
    id: 4,
    nama: "Budi Santoso, S.Par.",
    nip: "19820115 200801 1 010",
    jabatan: null, // Contoh guru tanpa jabatan khusus
    kejuruan: "Perhotelan",
    email: "budi.santoso@smkn2malang.sch.id",
    kontak: "+62 857-1122-3344",
    foto: "/images/guru/budi-santoso.jpg"
  },
  {
    id: 5,
    nama: "Dewi Lestari, S.S.T.",
    nip: "19880908 201402 2 004",
    jabatan: "Kepala Bengkel / Lab Kuliner",
    kejuruan: "Kuliner",
    email: "dewi.lestari@smkn2malang.sch.id",
    kontak: "+62 821-4433-2211",
    foto: "/images/guru/dewi-lestari.jpg"
  },
  {
    id: 6,
    nama: "Ahmad Fauzi, S.Kep., Ns.",
    nip: "19900418 201903 1 008",
    jabatan: null, // Guru biasa tanpa jabatan
    kejuruan: "Layanan Penunjang Keperawatan",
    email: "ahmad.fauzi@smkn2malang.sch.id",
    kontak: "+62 888-9900-1122",
    foto: "/images/guru/ahmad-fauzi.jpg"
  },
  {
    id: 7,
    nama: "Rina Kartika, S.Sos.",
    nip: "19851125 201001 2 006",
    jabatan: "Waka Kesiswaan",
    kejuruan: "Pekerjaan Sosial",
    email: "rina.kartika@smkn2malang.sch.id",
    kontak: "+62 878-6655-4433",
    foto: "/images/guru/rina-kartika.jpg"
  },
  {
    id: 8,
    nama: "Eko Prasetyo, S.Par.",
    nip: "19870712 201101 1 003",
    jabatan: null,
    kejuruan: "Usaha Layanan Wisata",
    email: "eko.prasetyo@smkn2malang.sch.id",
    kontak: "+62 812-7788-9900",
    foto: "/images/guru/eko-prasetyo.jpg"
  },
];

const DAFTAR_KEJURUAN = [
  "Semua Kejuruan",
  "Manajerial Sekolah",
  "Teknik Komputer dan Jaringan",
  "Perhotelan",
  "Kuliner",
  "Layanan Penunjang Keperawatan",
  "Pekerjaan Sosial",
  "Usaha Layanan Wisata",
];

export default function OrganisasiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKejuruan, setSelectedKejuruan] = useState("Semua Kejuruan");

  const filteredGuru = DATA_GURU.filter((guru) => {
    const matchSearch =
      guru.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.nip.includes(searchTerm) ||
      (guru.jabatan && guru.jabatan.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchKejuruan =
      selectedKejuruan === "Semua Kejuruan" || guru.kejuruan === selectedKejuruan;

    return matchSearch && matchKejuruan;
  });

  const handleReset = () => {
    setSearchTerm("");
    setSelectedKejuruan("Semua Kejuruan");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-12">
        
        {/* PARAGRAF PENGANTAR UTAMA */}
        <section className="space-y-4 text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-4 py-1.5 rounded-full border border-amber-200">
            WADAH KEPEMIMPINAN & KARAKTER
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Organisasi SMK Negeri 2 Malang
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Organisasi di SMK Negeri 2 Malang menjadi wadah bagi peserta didik untuk belajar kepemimpinan, tanggung jawab, kerja sama, dan demokrasi dalam lingkungan sekolah. Melalui organisasi, siswa memperoleh ruang untuk berpartisipasi aktif dalam kehidupan sekolah sekaligus mengembangkan keterampilan sosial dan karakter yang diperlukan di masa depan.
          </p>
        </section>

        {/* NALAR ORGANISASI SEKOLAH */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">OSIS dan MPK</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organisasi utama siswa di SMK Negeri 2 Malang adalah OSIS dan MPK yang berperan sebagai sarana pembinaan kepemimpinan dan aspirasi peserta didik. Kegiatan seperti serah terima jabatan, pemilihan ketua, debat calon pengurus, dan Latihan Dasar Kepemimpinan Siswa (LDKS) menjadi bagian penting dari proses kaderisasi organisasi siswa.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
              <Vote className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Pembelajaran Demokrasi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Melalui proses pemilihan dan pelantikan pengurus, siswa belajar tentang demokrasi, musyawarah, tanggung jawab, serta pentingnya integritas dalam kepemimpinan. Kegiatan pemilu OSIS dan MPK yang digelar layaknya pemilu nyata memberi pengalaman langsung kepada siswa untuk memahami proses partisipatif secara sehat dan tertib.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Penguatan Karakter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organisasi siswa tidak hanya membentuk calon pemimpin, tetapi juga melatih kedisiplinan, keberanian berpendapat, dan kemampuan menyelesaikan tugas secara kolektif. Melalui berbagai kegiatan kepengurusan, siswa dibiasakan untuk bekerja secara terstruktur, kreatif, dan bertanggung jawab terhadap amanah yang diemban.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3 md:col-span-1 lg:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Peran Sekolah</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              SMK Negeri 2 Malang memberikan dukungan penuh terhadap kegiatan organisasi siswa sebagai bagian dari pendidikan karakter dan pembinaan kepemimpinan. Sekolah menempatkan OSIS dan MPK sebagai ruang pembelajaran yang nyata agar siswa tidak hanya unggul secara akademik, tetapi juga matang secara sosial dan organisatoris.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3 md:col-span-2 lg:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Komitmen Sekolah</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              SMK Negeri 2 Malang berkomitmen menumbuhkan budaya organisasi yang aktif, sehat, dan demokratis di lingkungan sekolah. Dengan pembinaan yang berkelanjutan, organisasi siswa diharapkan menjadi sarana lahirnya generasi muda yang berintegritas, visioner, dan siap memimpin di masa depan.
            </p>
          </div>
        </section>

        {/* GAMBAR STRUKTUR ORGANISASI */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wider pb-3 border-b border-slate-100">
            <Award className="w-5 h-5" />
            <span>Struktur Manajerial & Organisasi Sekolah</span>
          </div>
          
          <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex justify-center items-center min-h-[300px]">
            <img
              src="/images/struktur-organisasi.png"
              alt="Struktur Organisasi SMKN 2 Malang"
              className="w-full h-auto object-contain max-h-[500px]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
              }}
            />
            <div className="hidden flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
              <Briefcase className="w-12 h-12 text-amber-500" />
              <p className="text-sm font-semibold text-slate-700">Bagan Struktur Organisasi</p>
              <p className="text-xs text-slate-500">
                Unggah berkas gambar ke <code className="text-amber-600 font-bold">public/images/struktur-organisasi.png</code>
              </p>
            </div>
          </div>
        </section>

        {/* FILTER & SEARCH DATA GURU */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            
            {/* Input Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama guru, NIP, atau jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>

            {/* Select Filter Kejuruan */}
            <div className="w-full md:w-64">
              <select
                value={selectedKejuruan}
                onChange={(e) => setSelectedKejuruan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              >
                {DAFTAR_KEJURUAN.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Tampilkan Semua */}
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tampilkan Semua</span>
            </button>
          </div>

          {/* DAFTAR GURU: FOTO DI KIRI & INFORMASI VERTIKAL SEJAJAR */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-500 px-1">
              <span>Menampilkan {filteredGuru.length} dari {DATA_GURU.length} Data Pendidik & Tenaga Kependidikan</span>
            </div>

            {filteredGuru.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredGuru.map((guru) => (
                  <div
                    key={guru.id}
                    className="bg-white hover:border-amber-400 border border-slate-200 rounded-2xl p-5 transition-all shadow-sm flex items-start gap-5"
                  >
                    {/* FOTO PROFIL (Paling Kiri) */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                      {guru.foto ? (
                        <img
                          src={guru.foto}
                          alt={guru.nama}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="hidden flex-col items-center justify-center text-slate-400">
                        <User className="w-8 h-8" />
                      </div>
                    </div>

                    {/* DETAIL INFORMASI (Disusun Vertikal Sejajar) */}
                    <div className="flex-1 space-y-1.5">
                      {/* 1. Nama */}
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                        {guru.nama}
                      </h3>

                      {/* 2. NIP */}
                      <p className="text-xs text-slate-500 font-mono">
                        NIP. {guru.nip}
                      </p>

                      {/* 3. Jabatan (Hanya tampil jika ada, jika null/kosong jurusan langsung naik ke atas) */}
                      {guru.jabatan && (
                        <p className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md inline-block border border-amber-200">
                          {guru.jabatan}
                        </p>
                      )}

                      {/* 4. Jurusan (Tulisan biasa berwarna biru tanpa kotak) */}
                      <p className="text-xs font-semibold text-blue-600">
                        {guru.kejuruan}
                      </p>

                      {/* 5. Kontak (Email & Telp) */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{guru.email}</span>
                        </div>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{guru.kontak}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
                <p className="text-slate-500 text-sm">Data pendidik/jabatan tidak ditemukan.</p>
                <button
                  onClick={handleReset}
                  className="mt-3 text-xs text-amber-600 font-bold underline hover:text-amber-700"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}