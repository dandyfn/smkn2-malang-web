"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DATA_FASILITAS } from "@/data/fasilitas";
import { Sparkles, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";

export default function FasilitasPage() {
  const [fasilitasAktif, setFasilitasAktif] = useState(DATA_FASILITAS[0]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-10 max-w-[1500px] mx-auto space-y-10">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-4">
          <span className="text-xs font-black uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> SARANA & PRASARANA
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Fasilitas <span className="text-amber-400">SMKN 2 Malang</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Mendukung proses belajar mengajar, kesehatan, serta kenyamanan seluruh warga sekolah dengan sarana terintegrasi.
          </p>
        </div>

        {/* SPLIT SHOWCASE (NO CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* MENU KIRI (NAVIGATION PANEL) */}
          <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-3xl p-3 sm:p-4 space-y-1.5 backdrop-blur-md sticky top-24">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-2">
              Pilih Fasilitas
            </p>
            {DATA_FASILITAS.map((item) => {
              const isSelected = fasilitasAktif.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setFasilitasAktif(item)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isSelected
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 translate-x-1"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <span>{item.nama}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "rotate-90 text-slate-950" : "text-slate-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* DISPLAY KANAN (THE STAGE) */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[550px] flex flex-col justify-between">
            
            {/* LARGE BANNER GAMBAR DENGAN GRADIENT */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
              <img
                src={fasilitasAktif.gambar}
                alt={fasilitasAktif.nama}
                className="w-full h-full object-cover transition-all duration-700 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              
              {/* BADGE DI ATAS FOTO */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-slate-900/80 border border-slate-700/80 text-amber-400 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-bold">
                  {fasilitasAktif.nama}
                </span>
              </div>
            </div>

            {/* DETAIL CONTENT BELOW PHOTO */}
            <div className="p-6 sm:p-10 space-y-6 relative z-10 -mt-20 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 rounded-t-3xl">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {fasilitasAktif.nama}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-amber-400">
                  {fasilitasAktif.tagline}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pt-2">
                  {fasilitasAktif.deskripsi}
                </p>
              </div>

              {/* FITUR UTAMA HIGHLIGHTS */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Keunggulan Sarana
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {fasilitasAktif.fiturUtama.map((fitur, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-200">{fitur}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}