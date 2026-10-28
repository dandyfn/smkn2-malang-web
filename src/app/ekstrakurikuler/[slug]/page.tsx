"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DATA_EKSTRAKURIKULER } from "@/data/ekstrakurikuler";
import { ArrowLeft, Calendar, MapPin, User, BookOpen, Images } from "lucide-react";

// KOMPONEN BACKGROUND BATIK (motif biru polos di atas latar putih, tanpa efek neon)
// Ubin gambar: public/images/batik-biru-tile.png
const BATIK_TILE = "/images/batik-biru-tile.png";
const BATIK_SIZE = "600px 400px"; // ukuran 1 ubin di layar. Kecilkan = motif lebih kecil & lebih rapat
const BATIK_OPACITY = 0.6;        // 0 - 1. Naikkan kalau kurang terlihat, turunkan kalau terlalu ramai

function BatikBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `url(${BATIK_TILE})`,
        backgroundRepeat: "repeat",
        backgroundSize: BATIK_SIZE,
        opacity: BATIK_OPACITY,
      }}
    />
  );
}

export default function DetailEkstrakurikulerPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // MENCARI DATA EKSKUL SESUAI SLUG URL
  const ekskul = DATA_EKSTRAKURIKULER.find((item) => item.slug === slug);

  // EFEK KEMIRINGAN FOTO GALERI ESTETIK
  const tiltStyles = [
    "-rotate-6 hover:rotate-0 hover:scale-105 z-10",
    "rotate-3 hover:rotate-0 hover:scale-105 z-20 translate-y-2",
    "-rotate-3 hover:rotate-0 hover:scale-105 z-10 -translate-y-1",
    "rotate-6 hover:rotate-0 hover:scale-105 z-20",
  ];

  // JIKA DATA TIDAK DITEMUKAN
  if (!ekskul) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-800 relative overflow-x-hidden">
        <BatikBackground />
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 relative">
          <h1 className="text-2xl font-bold text-slate-900">Ekstrakurikuler Tidak Ditemukan</h1>
          <p className="text-slate-500 text-sm">Halaman ekstrakurikuler yang kamu cari tidak ada atau telah dipindahkan.</p>
          <Link
            href="/ekstrakurikuler"
            className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600 transition"
          >
            Kembali ke Katalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 relative overflow-x-hidden">
      {/* BACKGROUND BATIK */}
      <BatikBackground />

      <Header />

      {/* CONTAINER FULL WIDTH */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-8 max-w-[1600px] mx-auto space-y-8 z-10 relative">
        
        {/* TOMBOL KEMBALI */}
        <div>
          <Link
            href="/ekstrakurikuler"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Ekstrakurikuler</span>
          </Link>
        </div>

        {/* HERO BANNER DINAMIS */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-4 max-w-3xl z-10">
            <span className="text-xs font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full inline-block">
              {ekskul.kategori}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {ekskul.nama}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {ekskul.deskripsi || "Ekstrakurikuler unggulan SMKN 2 Malang untuk mengembangkan minat, bakat, serta kedisiplinan siswa."}
            </p>
          </div>

          {/* INFORMASI RINGKAS */}
          <div className="bg-slate-800/80 border border-slate-700/60 backdrop-blur-md p-5 rounded-2xl w-full lg:w-80 shrink-0 space-y-3 text-xs z-10">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400">Pembina Ekskul</p>
                <p className="font-bold text-slate-100">{ekskul.pembina}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400">Jadwal Latihan</p>
                <p className="font-bold text-slate-100">{ekskul.hari.join(", ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400">Lokasi Latihan</p>
                <p className="font-bold text-slate-100">{ekskul.lokasi}</p>
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT GRID DUA KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI (PROGRAM & AGENDA LATIHAN SEBAGAI DESKRIPSI) - 7 KOLOM */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" /> Program & Agenda Latihan
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {ekskul.deskripsi ||
                  "Program dan agenda latihan dirancang secara terstruktur untuk mengasah kemampuan teknis, pembentukan karakter, kepemimpinan, serta kerja sama tim siswa SMKN 2 Malang secara berkelanjutan."}
              </p>
            </div>
          </div>

          {/* KOLOM KANAN (GALERI FOTO MIRING ESTETIK) - 5 KOLOM */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <Images className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-extrabold text-slate-900">Galeri Kegiatan</h2>
            </div>
            
            {/* GRID GALERI POLAROID ESTETIK */}
            <div className="grid grid-cols-2 gap-4 pt-4 pb-6">
              {[1, 2, 3, 4].map((item, idx) => (
                <div
                  key={idx}
                  className={`relative bg-white p-2.5 rounded-2xl shadow-md border border-slate-200 transition-all duration-300 transform cursor-pointer ${
                    tiltStyles[idx % tiltStyles.length]
                  }`}
                >
                  <div className="h-36 sm:h-44 w-full rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={(ekskul as any).gambar || "/images/smkn2logo.png"}
                      alt={`Dokumentasi ${ekskul.nama}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 text-center mt-2 tracking-wider uppercase">
                    Kegiatan #{idx + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}