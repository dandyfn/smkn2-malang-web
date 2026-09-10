"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DATA_KONSENTRASI } from "@/data/konsentrasi-keahlian";
import { Cpu, Award, Building2, Search, ArrowRight, CheckCircle2 } from "lucide-react";

export default function KonsentrasiKeahlianPage() {
  const [search, setSearch] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const daftarKategori = ["Semua", "Teknologi Informasi", "Kesehatan", "Pariwisata & Seni", "Pariwisata"];

  const filteredData = DATA_KONSENTRASI.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase());
    const matchKategori =
      kategoriAktif === "Semua" || item.kategori.toLowerCase() === kategoriAktif.toLowerCase();
    return matchSearch && matchKategori;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-10 max-w-[1600px] mx-auto space-y-10">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <span className="text-xs font-black uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/30 px-4 py-1.5 rounded-full inline-block">
            Program Keahlian Masa Depan
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Konsentrasi Keahlian <span className="text-amber-400">SMKN 2 Malang</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Kurikulum berbasis industri yang dirancang untuk membekali siswa dengan kompetensi teknis unggulan dan kesiapan kerja tinggi.
          </p>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
          {/* SEARCH */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari jurusan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* KATEGORI BUTTONS */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {daftarKategori.map((kat) => (
              <button
                key={kat}
                onClick={() => setKategoriAktif(kat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  kategoriAktif === kat
                    ? "bg-amber-400 text-slate-950 shadow-md"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID KARTU IDE 1 (BLUEPRINT CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300 shadow-xl group"
            >
              <div className="space-y-6">
                
                {/* HEADER KARTU & GAMBAR */}
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* BADGE PROSPEK KERJA */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <Award className="w-3.5 h-3.5" />
                      Prospek: {item.prospekUtama}
                    </span>
                    <span className="text-xs font-black text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 backdrop-blur-xs">
                      {item.kode}
                    </span>
                  </div>
                </div>

                {/* INFO JURUSAN */}
                <div>
                  <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest">
                    {item.kategori}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1 group-hover:text-amber-400 transition">
                    {item.nama}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-2">
                    {item.deskripsi}
                  </p>
                </div>

                {/* SKILL PROGRESS BARS */}
                <div className="bg-slate-950/70 border border-slate-800/80 p-4 sm:p-5 rounded-2xl space-y-3.5">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" /> Competency Skillset
                  </p>
                  
                  {item.skills.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>{s.nama}</span>
                        <span className="text-amber-400 font-mono">{s.persen}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000"
                          style={{ width: `${s.persen}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* FOOTER MITRA INDUSTRI */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-400" /> Mitra Industri (DUDI)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.mitra.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shrink-0">
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* JIKA DATA TIDAK DITEMUKAN */}
        {filteredData.length === 0 && (
          <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <p className="text-slate-400 text-sm">Tidak ada jurusan yang cocok dengan pencarian kamu.</p>
            <button
              onClick={() => {
                setSearch("");
                setKategoriAktif("Semua");
              }}
              className="text-xs font-bold text-amber-400 underline"
            >
              Reset Filter
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}