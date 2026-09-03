"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* 1. TOP BAR INFORMASI */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-6 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Jl. Veteran No. 17, Malang, Jawa Timur | 
            <Phone className="w-3.5 h-3.5 text-amber-400 ml-1" /> (0341) 551504
          </p>
          <div className="flex gap-4 font-medium">
            <a href="#" className="hover:text-amber-400 transition">BKK (Bursa Kerja)</a>
            <span>•</span>
            <a href="#" className="hover:text-amber-400 transition">PPDB 2026/2027</a>
          </div>
        </div>
      </div>

      {/* 2. HEADER NAVBAR UTAMA */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand (Navigasi Kembali ke Beranda) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <img
                src="/images/smkn2logo.png"
                alt="Logo SMKN 2 Malang"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-lg tracking-wider leading-none">SMKN 2</span>
              <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase mt-1">MALANG</span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-1 font-semibold text-sm">
            {/* Link Beranda Menggunakan Next.js Link */}
            <Link 
              href="/" 
              className="px-4 py-2 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition"
            >
              Beranda
            </Link>

            {/* Dropdown Tentang */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 hover:text-amber-600 group-hover:bg-slate-100 transition">
                <span>Tentang</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-amber-600 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 w-56">
                <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xl ring-1 ring-black/5">
                  <Link href="/profil" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-50 border-l-2 border-amber-500 transition">
                    <span className="text-xs font-bold text-amber-600">01</span> Profil Singkat
                  </Link>
                  <Link 
                    href="/organisasi" 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-50 border-l-2 border-transparent hover:border-amber-500 transition"
                  >
                    <span className="text-xs font-bold text-amber-600">02</span> Organisasi
                  </Link>
                  <a href="/#prestasi" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-50 hover:border-l-2 hover:border-amber-500 transition">
                    <span className="text-xs font-bold text-amber-600">03</span> Prestasi
                  </a>
                </div>
              </div>
            </div>

            {/* Dropdown Akademik */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 hover:text-amber-600 group-hover:bg-slate-100 transition">
                <span>Akademik</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-amber-600 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 w-56">
                <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xl ring-1 ring-black/5">
                  <a href="/#beasiswa" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-50 hover:border-l-2 hover:border-amber-500 transition">
                    <span className="text-xs font-bold text-amber-600">01</span> Beasiswa
                  </a>
                  <a href="/#kalender" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-50 hover:border-l-2 hover:border-amber-500 transition">
                    <span className="text-xs font-bold text-amber-600">02</span> Kalender Akademik
                  </a>
                  <a href="/#ekstrakurikuler" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-50 hover:border-l-2 hover:border-amber-500 transition">
                    <span className="text-xs font-bold text-amber-600">03</span> Ekstrakurikuler
                  </a>
                </div>
              </div>
            </div>

            <a href="/#keahlian" className="px-4 py-2 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition">
              Konsentrasi Keahlian
            </a>

            <a href="/#fasilitas" className="px-4 py-2 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition">
              Fasilitas
            </a>

            <a href="/#kontak" className="px-4 py-2 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition">
              Kontak
            </a>
          </nav>

          {/* Tombol Portal PPDB */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/#ppdb" className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20">
              Portal PPDB
            </a>
          </div>

        </div>
      </header>
    </>
  );
}