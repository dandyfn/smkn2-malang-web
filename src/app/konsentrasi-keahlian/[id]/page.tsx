"use client";

import { use, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DATA_KONSENTRASI } from "@/data/konsentrasi-keahlian";
import { ArrowLeft, Award, BookOpen, Briefcase, Building2, CheckCircle2, Sparkles } from "lucide-react";

export default function DetailKonsentrasiPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dataJurusan = DATA_KONSENTRASI.find((item) => item.id === resolvedParams.id);
  const [tabAktif, setTabAktif] = useState<"materi" | "karier" | "fasilitas">("materi");

  if (!dataJurusan) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black">Jurusan Tidak Ditemukan</h1>
          <Link href="/konsentrasi-keahlian" className="text-amber-400 underline text-sm">
            Kembali ke daftar jurusan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-10 max-w-[1400px] mx-auto space-y-8">
        
        {/* TOMBOL KEMBALI */}
        <Link
          href="/konsentrasi-keahlian"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Konsentrasi Keahlian
        </Link>

        {/* HERO HEADER JURUSAN (BAGIAN TOOLS/SKILLS DIBAWAHNYA SUDAH DIHAPUS) */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 p-6 sm:p-10">
          <div className="absolute inset-0 z-0">
            <img
              src={dataJurusan.gambar}
              alt={dataJurusan.nama}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl uppercase tracking-wider">
                {dataJurusan.singkatan}
              </span>
              <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> SMKN 2 Malang
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {dataJurusan.nama}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {dataJurusan.deskripsi}
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-800 gap-4 overflow-x-auto">
          <button
            onClick={() => setTabAktif("materi")}
            className={`pb-4 text-xs font-bold flex items-center gap-2 transition shrink-0 border-b-2 ${
              tabAktif === "materi"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Materi & Kompetensi
          </button>
          
          <button
            onClick={() => setTabAktif("karier")}
            className={`pb-4 text-xs font-bold flex items-center gap-2 transition shrink-0 border-b-2 ${
              tabAktif === "karier"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Prospek Karier
          </button>

          <button
            onClick={() => setTabAktif("fasilitas")}
            className={`pb-4 text-xs font-bold flex items-center gap-2 transition shrink-0 border-b-2 ${
              tabAktif === "fasilitas"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" /> Fasilitas & Lab
          </button>
        </div>

        {/* TAB CONTENT AREA */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8">
          
          {/* TAB 1: MATERI */}
          {tabAktif === "materi" && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" /> Fokus Pembelajaran
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {dataJurusan.materiPembelajaran.map((materi, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-200">{materi}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: KARIER */}
          {tabAktif === "karier" && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Peluang Kerja Lulusan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {dataJurusan.peluangKarier.map((karier, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-200">{karier}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FASILITAS (DENGAN BANNER GAMBAR & NAMA MENGAMBANG TRANSPARAN) */}
          {tabAktif === "fasilitas" && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" /> Fasilitas Laboratorium Praktik
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {dataJurusan.fasilitasLab.map((fasilitas, idx) => (
                  <div
                    key={idx}
                    className="group relative h-48 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md flex items-end p-5"
                  >
                    {/* GAMBAR BANNER FASILITAS */}
                    <img
                      src={dataJurusan.gambar}
                      alt={fasilitas}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                    />

                    {/* OVERLAY GRADIENT AGAR TEKS TRANSPARAN TETAP TERBACA */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                    {/* NAMA FASILITAS MENGAMBANG TRANSPARAN (GLASSMORPHISM) */}
                    <div className="relative z-10 w-full bg-slate-900/60 backdrop-blur-md border border-white/10 p-3 rounded-xl">
                      <p className="text-xs sm:text-sm font-bold text-white text-center group-hover:text-amber-400 transition">
                        {fasilitas}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}