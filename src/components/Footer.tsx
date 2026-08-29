"use client";

import { MapPin, Phone, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer id="kontak" className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs relative z-30">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Kolom 1: Profil */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 font-black text-slate-950 flex items-center justify-center text-sm shadow">
              N2
            </div>
            <span className="font-black text-white text-base tracking-wider">
              SMKN 2 MALANG
            </span>
          </div>
          <p className="leading-relaxed">
            Sekolah Menengah Kejuruan Negeri 2 Malang unggul dalam mencetak tenaga kerja profesional dan berkarakter.
          </p>
        </div>

        {/* Kolom 2: Unit Produksi & Layanan */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
            Unit Produksi
          </h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-amber-400 transition">Edotel SMKN 2 Malang</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Katering & Bakery</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Jasa IT & Networking</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">LPS & Sertifikasi Profesi</a></li>
          </ul>
        </div>

        {/* Kolom 3: Tautan Terkait */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
            Tautan Terkait
          </h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-amber-400 transition">Kemdikbudristek</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Dinas Pendidikan Jatim</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Portal PPDB Jatim</a></li>
            <li><a href="#" className="hover:text-amber-400 transition">Bursa Kerja Khusus (BKK)</a></li>
          </ul>
        </div>

        {/* Kolom 4: Kontak */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
            Hubungi Kami
          </h4>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Jl. Veteran No. 17, Lowokwaru, Kota Malang, Jawa Timur</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>(0341) 551504</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>smkn2malang@yahoo.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800 py-6 text-center text-slate-500 text-[11px]">
        <p>© 2026 SMK Negeri 2 Malang. All Rights Reserved.</p>
      </div>
    </footer>
  );
}