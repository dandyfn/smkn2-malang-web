"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DATA_EKSTRAKURIKULER } from "@/data/ekstrakurikuler";
import { Search, Calendar, MapPin, User, ArrowRight, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

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

export default function EkstrakurikulerBookPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // Filter data berdasarkan kata kunci pencarian
  const filteredData = DATA_EKSTRAKURIKULER.filter((item) => {
    return (
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pembina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = filteredData.length > 0 ? filteredData.length : 1;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const activeEkskul = filteredData[currentPage];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 relative overflow-x-hidden">
      {/* BACKGROUND BATIK */}
      <BatikBackground />

      <Header />

      <main className="flex-1 py-8 px-4 sm:px-8 max-w-6xl mx-auto w-full flex flex-col items-center justify-center space-y-6 z-10 relative">
        
        {/* BAR PENCARIAN */}
        <div className="w-full max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ekstrakurikuler (e.g. Basket, Pramuka, Paskibra)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-xl transition"
          />
        </div>

        {/* BUKU INTERAKTIF CONTAINER */}
        <div className="relative w-full flex items-center justify-center my-4">
          
          {/* TOMBOL NAVIGASI KIRI */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`absolute -left-2 sm:-left-6 z-30 p-3 sm:p-4 rounded-full border border-slate-700 bg-slate-800/90 text-amber-400 shadow-2xl transition hover:scale-110 active:scale-95 ${
              currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-amber-400 hover:text-slate-950"
            }`}
            aria-label="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* AREA FISIK BUKU */}
          <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row min-h-[520px] divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
            {/* SISI KIRI BUKU */}
            <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-center relative bg-slate-900/50 rounded-2xl md:rounded-r-none">
              <div className="space-y-6 text-left">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/30 inline-flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> KATALOG DIGITAL
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Ekstrakurikuler <br />
                  <span className="text-amber-400">SMKN 2 Malang</span>
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Temukan kegiatan non-akademik sesuai passion dan minat bakatmu. Kembangkan potensi diri dan ukir prestasi bersama pendamping profesional.
                </p>
              </div>
            </div>

            {/* SISI KANAN BUKU */}
            <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-center relative bg-slate-900/30 rounded-2xl md:rounded-l-none">
              <AnimatePresence mode="wait">
                {activeEkskul ? (
                  <motion.div
                    key={activeEkskul.id}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-full flex flex-col justify-between space-y-4"
                  >
                    {/* GAMBAR BANNER KARTU */}
                    <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                      <img
                        src={(activeEkskul as any).gambar || "/images/smkn2logo.png"}
                        alt={activeEkskul.nama}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      
                      <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        {activeEkskul.kategori}
                      </span>
                    </div>

                    {/* DETAIL SINGKAT KARTU */}
                    <div className="space-y-3 text-left">
                      <h3 className="text-xl font-extrabold text-amber-400">
                        {activeEkskul.nama}
                      </h3>

                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                          <span><strong>Hari:</strong> {activeEkskul.hari.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                          <span><strong>Lokasi:</strong> {activeEkskul.lokasi}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-amber-400 shrink-0" />
                          <span><strong>Pembina:</strong> {activeEkskul.pembina}</span>
                        </div>
                      </div>
                    </div>

                    {/* TOMBOL BUKA HALAMAN DETAIL */}
                    <Link
                      href={`/ekstrakurikuler/${activeEkskul.slug}`}
                      className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-400/10 group mt-2"
                    >
                      <span>Lihat Detail Ekskul</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                ) : (
                  <div className="my-auto text-center space-y-3 py-12">
                    <p className="text-slate-400 text-sm">
                      Ekstrakurikuler tidak ditemukan.
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-xs font-bold text-amber-400 underline"
                    >
                      Reset Pencarian
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* TOMBOL NAVIGASI KANAN */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1 || filteredData.length === 0}
            className={`absolute -right-2 sm:-right-6 z-30 p-3 sm:p-4 rounded-full border border-slate-700 bg-slate-800/90 text-amber-400 shadow-2xl transition hover:scale-110 active:scale-95 ${
              currentPage === totalPages - 1 || filteredData.length === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-amber-400 hover:text-slate-950"
            }`}
            aria-label="Halaman Selanjutnya"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

        </div>

      </main>

      <Footer />
    </div>
  );
}