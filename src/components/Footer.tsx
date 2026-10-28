"use client";

import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

type FooterLink = { label: string; href: string };
type FooterSection = { title: string; links: FooterLink[] };

const sections: FooterSection[] = [
  {
    title: "Unit Produksi",
    links: [
      { label: "Aula SC Pertamina", href: "https://aula.smkn2malang.sch.id/" },
      { label: "KADOEA Senior Living", href: "" },
      { label: "Edotel", href: "" },
      { label: "TSA Samuphahita", href: "" },
    ],
  },
  {
    title: "Layanan Digital",
    links: [
      { label: "Sistem Informasi Akademik", href: "https://siska.smkn2malang.sch.id/login" },
      { label: "E-Learning", href: "" },
      { label: "E-Library", href: "" },
      { label: "Bursa Kerja Khusus", href: "" },
    ],
  },
  {
    title: "Tautan Terkait",
    links: [
      { label: "Kemendikdasmen", href: "https://www.kemendikdasmen.go.id/" },
      { label: "Dinas Pendidikan Provinsi Jawa Timur", href: "https://dindik.jatimprov.go.id/" },
      { label: "Badan Kepegawaian Daerah Provinsi Jawa Timur", href: "https://bkd.jatimprov.go.id/" },
      { label: "Portal GTK", href: "https://portal.simpkb.id/" },
      { label: "Kurikulum Merdeka", href: "https://kurikulum.kemendikdasmen.go.id/" },
    ],
  },
  {
    title: "Sosial Media",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/smkn2malang/" },
      { label: "TikTok", href: "https://www.tiktok.com/@samupahita" },
      { label: "YouTube", href: "https://www.youtube.com/@smkn2malang931" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/school/smkn2malang/?originalSubdomain=id",
      },
    ],
  },
];

function FooterLinkItem({ label, href }: FooterLink) {
  // Link belum tersedia: tampilkan sebagai teks redup
  if (!href) {
    return (
      <li>
        <span
          className="text-slate-600 cursor-not-allowed"
          title="Segera hadir"
        >
          {label}
        </span>
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-start gap-1.5 hover:text-amber-400 transition"
      >
        <span>{label}</span>
        <ExternalLink className="w-3 h-3 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition" />
      </a>
    </li>
  );
}

export default function Footer() {
  return (
    <footer
      id="kontak"
      className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs relative z-30"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Kolom Profil */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 font-black text-slate-950 flex items-center justify-center text-sm shadow">
              N2
            </div>
            <span className="font-black text-white text-base tracking-wider">
              SMKN 2 MALANG
            </span>
          </div>
          <p className="leading-relaxed">
            Sekolah Menengah Kejuruan Negeri 2 Malang unggul dalam mencetak
            tenaga kerja profesional dan berkarakter.
          </p>
        </div>

        {/* Kolom-kolom tautan */}
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <FooterLinkItem key={link.label} {...link} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Kontak */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="font-extrabold text-white text-sm uppercase tracking-wider">
            Hubungi Kami
          </span>
          <ul className="flex flex-col md:flex-row gap-3 md:gap-8">
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