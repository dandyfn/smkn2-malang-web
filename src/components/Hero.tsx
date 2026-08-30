"use client";

import Image from "next/image";
import { ArrowDown, Play } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-[170vh]">
      {/* Background Image Sticky Parallax */}
      <div className="sticky top-20 h-[calc(100vh-5rem)] w-full overflow-hidden z-0 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40 z-10" />
        <Image
          src="/images/hero-bg.png"
          alt="Gedung SMKN 2 Malang"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center scale-105"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-20 -mt-[calc(100vh-5rem)]">
        {/* 1. Hero Main Section */}
        <section className="h-[calc(100vh-5rem)] flex items-center justify-center px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block bg-amber-400 text-slate-950 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider shadow-lg shadow-amber-400/20">
              Empowering Future Professionals
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-6 drop-shadow-md">
              Membentuk Generasi Unggul, Mandiri, dan{" "}
              <span className="text-amber-400">Siap Kerja</span>
            </h1>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-normal drop-shadow">
              SMK Negeri 2 Malang menghadirkan pendidikan kejuruan berstandar
              industri dengan 6 konsentrasi keahlian unggulan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#kenapa-smkn2"
                className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl transition border border-blue-700/50"
              >
                Jelajahi SMKN 2 Malang <ArrowDown className="w-4 h-4" />
              </a>
              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold px-7 py-3.5 rounded-xl transition">
                <Play className="w-4 h-4 fill-white" /> Lihat Video Profil
              </button>
            </div>
          </div>
        </section>

        {/* 2. Keunggulan Utama Section */}
        <section
          id="kenapa-smkn2"
          className="min-h-[80vh] flex items-center justify-center px-6 py-20"
        >
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-slate-900/90 backdrop-blur px-3.5 py-1.5 rounded-md border border-amber-400/30 inline-block mb-3 shadow-md">
                Keunggulan Utama
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white drop-shadow-lg">
                Kenapa Harus SMKN 2 Malang?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-8 rounded-2xl text-white shadow-2xl hover:border-amber-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md group-hover:scale-110 transition duration-300">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Standar Industri DUDI
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Kurikulum terintegrasi langsung dengan puluhan mitra
                  perusahaan nasional & internasional.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-8 rounded-2xl text-white shadow-2xl hover:border-amber-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md group-hover:scale-110 transition duration-300">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  6 Konsentrasi Unggulan
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Fasilitas ruang praktik modern untuk Perhotelan, Kuliner,
                  Keperawatan, TKJ, Wisata, dan PKS.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-8 rounded-2xl text-white shadow-2xl hover:border-amber-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-md group-hover:scale-110 transition duration-300">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Penyaluran Kerja BKK
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Bursa Kerja Khusus (BKK) aktif mendampingi alumni hingga
                  terserap penuh di DUDI.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}