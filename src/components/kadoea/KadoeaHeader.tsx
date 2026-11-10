"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Menu, X } from "lucide-react";
import { KADOEA_KONTAK } from "@/data/kadoea";

const MENU = [
  { label: "Tentang", href: "#tentang" },
  { label: "Paket", href: "#paket" },
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "FAQ", href: "#faq" },
  { label: "Ulasan", href: "#ulasan" },
  { label: "Kontak", href: "#kontak" },
];

export default function KadoeaHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bar info atas, sama seperti header website sekolah */}
      <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-xs py-2 px-4 sm:px-6 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-2">
          <p className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">Jl. Veteran No. 17, Malang</span>
            <span className="hidden sm:inline">|</span>
            <Phone className="w-3 h-3 text-amber-400 ml-1 shrink-0 hidden sm:inline" />
            <span className="hidden sm:inline">{KADOEA_KONTAK.telepon}</span>
          </p>
          <Link href="/" className="font-medium hover:text-amber-400 transition">
            Unit Produksi SMK Negeri 2 Malang
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <a href="#beranda" className="flex items-center gap-2.5 sm:gap-3">
            {/* Logo SMKN 2 Malang, sama seperti header website sekolah */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex items-center justify-center">
              <img
                src="/images/smkn2logo.png"
                alt="Logo SMKN 2 Malang"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-base sm:text-lg tracking-wider leading-none">KADOEA</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 tracking-widest uppercase mt-0.5 sm:mt-1">
                Senior Living
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1 font-semibold text-sm">
            {MENU.map((m) => (
              <a key={m.href} href={m.href} className="px-4 py-2 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition">
                {m.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={KADOEA_KONTAK.teleponLink}
              className="hidden sm:inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition"
            >
              <Phone className="w-4 h-4" /> Reservasi
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Buka menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu ponsel */}
        {open && (
          <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            {MENU.map((m) => (
              <a
                key={m.href}
                href={m.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600"
              >
                {m.label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
