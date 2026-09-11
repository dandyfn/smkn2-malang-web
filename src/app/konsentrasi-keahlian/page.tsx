"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DATA_KONSENTRASI } from "@/data/konsentrasi-keahlian";
import { Search, ArrowUpRight, Sparkles, Award, Layers } from "lucide-react";
import Link from "next/link";

export default function KonsentrasiKeahlianPage() {
  const [search, setSearch] = useState("");

  // FILTER HANYA BERDASARKAN INPUTAN SEARCH
  const filteredData = DATA_KONSENTRASI.filter((item) => {
    return (
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.singkatan.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-10 max-w-[1600px] mx-auto space-y-10">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <span className="text-xs font-black uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> EKSPLORASI MASA DEPAN
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Konsentrasi Keahlian <span className="text-amber-400">SMKN 2 Malang</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Pilih jalur keahlian impianmu. Dilengkapi dengan fasilitas praktik modern dan penyaluran karier berstandar industri.
          </p>
        </div>

        {/* SEARCH BAR (TANPA KATEGORI) */}
        <div className="max-w-xl mx-auto w-full bg-slate-950/60 border border-slate-800 p-2 rounded-2xl backdrop-blur-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari jurusan atau singkatan (misal: TKJ, LPKC, KL)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>

        {/* SHOWCASE CARDS GRID (6 JURUSAN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[460px] flex flex-col justify-between p-6 sm:p-8 hover:border-amber-400/60 transition-all duration-500 shadow-2xl"
            >
              {/* BANNER BACKGROUND GAMBAR */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
              </div>

              {/* HEADER CARD: HANYA SINGKATAN DI POJOK KANAN ATAS BANNER */}
              <div className="relative z-10 flex justify-end">
                <span className="bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-4 py-1.5 rounded-xl shadow-lg uppercase tracking-wider">
                  {item.singkatan}
                </span>
              </div>

              {/* KONTEN UTAMA & GLASS PANEL */}
              <div className="relative z-10 space-y-5 mt-auto pt-10">
                
                {/* JUDUL & DESKRIPSI */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-400 transition-colors duration-300">
                    {item.nama}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2">
                    {item.deskripsi}
                  </p>
                </div>

                {/* GLASSMORPHISM PANEL */}
                <div className="bg-slate-900/80 border border-slate-700/50 backdrop-blur-md p-4 sm:p-5 rounded-2xl space-y-4 group-hover:border-amber-400/40 transition-all duration-300">
                  
                  {/* PROSPEK KERJA */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 border-b border-slate-800 pb-3">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Prospek Karier: </span>
                    <strong className="text-white font-bold">{item.prospekUtama}</strong>
                  </div>

                  {/* CORE SKILL BADGES */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-amber-400" /> Competency Highlights
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.toolsAndSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-950/80 border border-slate-800 text-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* FOOTER BUTTON */}
                <div className="flex justify-end pt-2">
                  <Link
                    href={`/konsentrasi-keahlian/${item.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shrink-0"
                  >
                    <span>Detail Jurusan</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredData.length === 0 && (
          <div className="text-center py-16 bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
            <p className="text-slate-400 text-sm">Jurusan dengan kata kunci tersebut tidak ditemukan.</p>
            <button
              onClick={() => setSearch("")}
              className="text-xs font-bold text-amber-400 underline"
            >
              Clear Pencarian
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}