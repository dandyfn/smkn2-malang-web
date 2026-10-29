"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { motion, useReducedMotion } from "framer-motion";
import MarqueeTrack from "@/components/MarqueeTrack";
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
  User,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2
} from "lucide-react";

interface Guru {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  kejuruan: string;
  email: string;
  kontak: string;
  foto_url: string;
  created_at?: string;
}

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

// Data Card Nalar Organisasi
const CARDS_ORGANISASI = [
  {
    icon: Users,
    title: "OSIS dan MPK",
    desc: "Organisasi utama siswa di SMK Negeri 2 Malang adalah OSIS dan MPK yang berperan sebagai sarana pembinaan kepemimpinan dan aspirasi peserta didik. Kegiatan seperti serah terima jabatan, pemilihan ketua, debat calon pengurus, dan Latihan Dasar Kepemimpinan Siswa (LDKS) menjadi bagian penting dari proses kaderisasi organisasi siswa.",
  },
  {
    icon: Vote,
    title: "Pembelajaran Demokrasi",
    desc: "Melalui proses pemilihan dan pelantikan pengurus, siswa belajar tentang demokrasi, musyawarah, tanggung jawab, serta pentingnya integritas dalam kepemimpinan. Kegiatan pemilu OSIS dan MPK yang digelar layaknya pemilu nyata memberi pengalaman langsung kepada siswa untuk memahami proses partisipatif secara sehat dan tertib.",
  },
  {
    icon: ShieldCheck,
    title: "Penguatan Karakter",
    desc: "Organisasi siswa tidak hanya membentuk calon pemimpin, tetapi juga melatih kedisiplinan, keberanian berpendapat, dan kemampuan menyelesaikan tugas secara kolektif. Melalui berbagai kegiatan kepengurusan, siswa dibiasakan untuk bekerja secara terstruktur, kreatif, dan bertanggung jawab terhadap amanah yang diemban.",
  },
  {
    icon: Building2,
    title: "Peran Sekolah",
    desc: "SMK Negeri 2 Malang memberikan dukungan penuh terhadap kegiatan organisasi siswa sebagai bagian dari pendidikan karakter dan pembinaan kepemimpinan. Sekolah menempatkan OSIS dan MPK sebagai ruang pembelajaran yang nyata agar siswa tidak hanya unggul secara akademik, tetapi juga matang secara sosial dan organisatoris.",
  },
  {
    icon: HeartHandshake,
    title: "Komitmen Sekolah",
    desc: "SMK Negeri 2 Malang berkomitmen menumbuhkan budaya organisasi yang aktif, sehat, dan demokratis di lingkungan sekolah. Dengan pembinaan yang berkelanjutan, organisasi siswa diharapkan menjadi sarana lahirnya generasi muda yang berintegritas, visioner, dan siap memimpin di masa depan.",
  },
];

export default function OrganisasiPage() {
  const reduceMotion = useReducedMotion();
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setScale(1);

  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKejuruan, setSelectedKejuruan] = useState("Semua Kejuruan");

  useEffect(() => {
    const fetchGuru = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("guru")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGuruList(data);
      }
      setLoading(false);
    };

    fetchGuru();
  }, []);

  const filteredGuru = guruList.filter((guru) => {
    const matchSearch =
      guru.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guru.nip && guru.nip.includes(searchTerm)) ||
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
    <div className="relative isolate min-h-screen flex flex-col bg-black text-slate-100">
      {/* STYLE MOTIF BATIK NEON (animasi denyut ditangani Framer Motion) */}
      <style jsx global>{`
        /* Motif batik mega mendung: kecil, banyak, baris berselang-seling (sudah diatur di dalam gambar tile) */
        .batik-neon {
          background-image: url("/images/batik-neon-tile.png");
          background-size: 300px 330px;
          background-repeat: repeat;
          /* Warna motif tetap; yang ditambahkan hanya cahaya (glow) dengan rona yang sama */
          filter: drop-shadow(0 0 2px rgba(129, 140, 248, 0.95))
                  drop-shadow(0 0 6px rgba(99, 102, 241, 0.85))
                  drop-shadow(0 0 14px rgba(79, 70, 229, 0.65));
        }
      `}</style>

      {/* BACKGROUND BATIK NEON (menempel di layar, berada di belakang semua konten) */}
      <motion.div
        aria-hidden="true"
        className="batik-neon fixed inset-0 -z-10 pointer-events-none"
        initial={{ opacity: 0.8 }}
        animate={reduceMotion ? { opacity: 0.9 } : { opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      />

      <Header />

      <main className="flex-1 py-12 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-12">

        {/* PARAGRAF PENGANTAR UTAMA */}
        <section className="space-y-4 text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 inline-block">
            WADAH KEPEMIMPINAN & KARAKTER
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Organisasi SMK Negeri 2 Malang
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Organisasi di SMK Negeri 2 Malang menjadi wadah bagi peserta didik untuk belajar kepemimpinan, tanggung jawab, kerja sama, dan demokrasi dalam lingkungan sekolah. Melalui organisasi, siswa memperoleh ruang untuk berpartisipasi aktif dalam kehidupan sekolah sekaligus mengembangkan keterampilan sosial dan karakter yang diperlukan di masa depan.
          </p>
        </section>

        {/* NALAR ORGANISASI SEKOLAH - MARQUEE CAROUSEL */}
        <section className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden py-4 my-6">
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          {/* Daftar kartu diulang 2x di sini supaya satu salinan cukup lebar untuk layar besar;
              MarqueeTrack menggandakannya sekali lagi untuk efek loop mulus */}
          <MarqueeTrack duration={35}>
            {[...CARDS_ORGANISASI, ...CARDS_ORGANISASI].map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={`${card.title}-${idx}`}
                  className="w-[300px] sm:w-[360px] bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-amber-500/50 hover:bg-slate-900 transition space-y-3 shrink-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/20">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-normal">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </MarqueeTrack>
        </section>

        {/* GAMBAR STRUKTUR ORGANISASI INTERAKTIF (STICKY ATAS) */}
        <section className="sticky top-20 z-0 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Award className="w-5 h-5" />
              <span>Struktur Manajerial & Organisasi Sekolah</span>
            </div>

            {/* TOMBOL KONTROL ZOOM */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-amber-400 px-2 min-w-[50px] text-center">
                {Math.round(scale * 100)}%
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition border-l border-slate-800 pl-2"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* KONTAINER GAMBAR */}
          <div className="relative w-full rounded-2xl overflow-auto border border-slate-800 bg-slate-950 h-[320px] sm:h-[400px] flex justify-center items-center">
            <div 
              className="w-full h-full transition-transform duration-200 ease-out origin-center flex items-center justify-center p-2"
              style={{ transform: `scale(${scale})` }}
            >
              <img
                src="/images/baganorganisasi.jpeg"
                alt="Struktur Organisasi SMKN 2 Malang"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallbackEl = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallbackEl) fallbackEl.classList.remove('hidden');
                }}
              />

              <div className="hidden flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
                <Briefcase className="w-12 h-12 text-amber-400" />
                <p className="text-sm font-semibold text-slate-200">Bagan Struktur Organisasi Tidak Ditemukan</p>
                <p className="text-xs text-slate-500">
                  Pastikan file tersimpan di <code className="text-amber-400 font-bold">public/images/baganorganisasi.jpeg</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FILTER & SEARCH DATA GURU */}
        {/* Section ini menutupi bagan yang sticky, jadi ia punya lapisan batik sendiri (background-attachment: fixed) agar sejajar dengan batik halaman */}
        <section className="relative z-10 bg-black pt-8 space-y-6 -mt-10 rounded-t-3xl overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.9)]">
          <div
            aria-hidden="true"
            className="batik-neon absolute inset-0 pointer-events-none"
            style={{ backgroundAttachment: "fixed" }}
          />

          <div className="relative flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">

            {/* Input Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama guru, NIP, atau jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>

            {/* Select Filter Kejuruan */}
            <div className="w-full md:w-64">
              <select
                value={selectedKejuruan}
                onChange={(e) => setSelectedKejuruan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition cursor-pointer"
              >
                {DAFTAR_KEJURUAN.map((k) => (
                  <option key={k} value={k} className="bg-slate-900 text-slate-200 py-1">
                    {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Tampilkan Semua */}
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/10 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tampilkan Semua</span>
            </button>
          </div>

          {/* DAFTAR GURU */}
          <div className="relative space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400 px-1">
              <span>Menampilkan {filteredGuru.length} dari {guruList.length} Data Pendidik & Tenaga Kependidikan</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-xs text-slate-400">Memuat data guru & staf...</p>
              </div>
            ) : filteredGuru.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredGuru.map((guru) => (
                  <div
                    key={guru.id}
                    className="bg-slate-900/80 hover:border-amber-500/50 border border-slate-800 rounded-2xl p-6 transition-all shadow-xl flex items-center gap-6 min-h-[180px]"
                  >
                    {/* FOTO PROFIL (Ukuran Presisi & Tinggi Konsisten) */}
                    <div className="relative w-36 sm:w-44 h-40 sm:h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center">
                      {guru.foto_url ? (
                        <img
                          src={guru.foto_url}
                          alt={guru.nama}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className={`flex-col items-center justify-center text-slate-600 ${guru.foto_url ? 'hidden' : 'flex'}`}>
                        <User className="w-12 h-12" />
                      </div>
                    </div>

                    {/* DETAIL INFORMASI */}
                    <div className="flex-1 flex flex-col justify-center space-y-2.5">
                      <div className="space-y-1">
                        <h3 className="font-bold text-white text-lg sm:text-2xl leading-snug">
                          {guru.nama}
                        </h3>
                        {guru.nip ? (
                          <p className="text-sm text-slate-400 font-mono tracking-wide">
                            NIP. {guru.nip}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-600 font-mono italic">
                            NIP. -
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {guru.jabatan && (
                          <p className="text-xs sm:text-sm font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                            {guru.jabatan}
                          </p>
                        )}
                        <p className="text-sm sm:text-base font-semibold text-sky-400">
                          {guru.kejuruan}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs sm:text-sm text-slate-400 pt-1">
                        {guru.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                            <span>{guru.email}</span>
                          </div>
                        )}
                        {guru.email && guru.kontak && <span className="hidden sm:inline text-slate-700">•</span>}
                        {guru.kontak && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                            <span>{guru.kontak}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-slate-400 text-sm">Data pendidik/jabatan tidak ditemukan.</p>
                <button
                  onClick={handleReset}
                  className="mt-3 text-xs text-amber-400 font-bold underline hover:text-amber-300"
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