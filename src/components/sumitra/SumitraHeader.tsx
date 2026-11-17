"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { tautanWa } from "@/data/sumitra";

const MENU = [
  { label: "Tentang", href: "/sumitra#tentang" },
  { label: "Paket", href: "/sumitra#paket" },
  { label: "Layanan", href: "/sumitra#layanan" },
  { label: "Testimoni", href: "/sumitra#testimoni" },
  { label: "FAQ", href: "/sumitra#faq" },
];

export function IkonWa({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}

export default function SumitraHeader({ nomorWa, logoUrl }: { nomorWa: string; logoUrl: string | null }) {
  const [buka, setBuka] = useState(false);
  const wa = tautanWa(nomorWa);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-4">
        <a href="/sumitra" className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl || "/images/smkn2logo.png"}
            alt={logoUrl ? "Logo Sumitra Kelana Wisata" : "Logo SMKN 2 Malang"}
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0"
          />
          <span className="min-w-0">
            <span className="block text-white font-extrabold text-[15px] sm:text-[17px] tracking-wide truncate">SUMITRA KELANA WISATA</span>
            <span className="block text-amber-400 text-[10px] sm:text-[11px] font-bold tracking-[0.08em]">UNIT PRODUKSI SMKN 2 MALANG</span>
          </span>
        </a>

        <nav aria-label="Navigasi Sumitra" className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {MENU.map((m) => (
            <a key={m.href} href={m.href} className="text-slate-300 hover:text-amber-400 transition">{m.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={wa ?? "/sumitra#kontak"}
            target={wa ? "_blank" : undefined}
            rel={wa ? "noopener noreferrer" : undefined}
            className="hidden sm:inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white text-sm font-bold px-4 py-3 rounded-xl transition min-h-11"
          >
            <IkonWa /> Konsultasi via WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setBuka(!buka)}
            className="lg:hidden p-2.5 rounded-xl text-slate-200 hover:bg-slate-800"
            aria-label={buka ? "Tutup menu" : "Buka menu"}
            aria-expanded={buka}
          >
            {buka ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {buka && (
        <nav aria-label="Navigasi Sumitra (ponsel)" className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
          {MENU.map((m) => (
            <a key={m.href} href={m.href} onClick={() => setBuka(false)}
              className="block px-4 py-3 rounded-xl font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400">
              {m.label}
            </a>
          ))}
          <a href={wa ?? "/sumitra#kontak"} target={wa ? "_blank" : undefined} rel={wa ? "noopener noreferrer" : undefined}
            className="mt-2 flex items-center justify-center gap-2 bg-teal-700 text-white font-bold px-4 py-3 rounded-xl">
            <IkonWa /> Konsultasi via WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
