"use client";

import { useState } from "react";
import { Award, BookOpen, Briefcase, Building2, CheckCircle2 } from "lucide-react";

type Tab = "materi" | "karier" | "fasilitas";

type Props = {
  gambar: string;
  materiPembelajaran: string[];
  peluangKarier: string[];
  fasilitasLab: string[];
};

const TABS: { id: Tab; label: string; Icon: typeof BookOpen }[] = [
  { id: "materi", label: "Materi & Kompetensi", Icon: BookOpen },
  { id: "karier", label: "Prospek Karier", Icon: Briefcase },
  { id: "fasilitas", label: "Fasilitas & Lab", Icon: Building2 },
];

export default function KonsentrasiTabs({
  gambar,
  materiPembelajaran,
  peluangKarier,
  fasilitasLab,
}: Props) {
  const [tabAktif, setTabAktif] = useState<Tab>("materi");

  return (
    <>
      <div className="flex border-b border-slate-800 gap-4 overflow-x-auto" role="tablist">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tabAktif === id}
            onClick={() => setTabAktif(id)}
            className={`pb-4 text-xs font-bold flex items-center gap-2 transition shrink-0 border-b-2 ${
              tabAktif === id
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className={tabAktif === "materi" ? "space-y-4" : "hidden"}>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" /> Fokus Pembelajaran
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {materiPembelajaran.map((materi, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200">{materi}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={tabAktif === "karier" ? "space-y-4" : "hidden"}>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Peluang Kerja Lulusan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {peluangKarier.map((karier, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-200">{karier}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={tabAktif === "fasilitas" ? "space-y-4" : "hidden"}>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" /> Fasilitas Laboratorium Praktik
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {fasilitasLab.map((fasilitas, idx) => (
              <div
                key={idx}
                className="group relative h-48 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md flex items-end p-5"
              >
                <img
                  src={gambar}
                  alt={fasilitas}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="relative z-10 w-full bg-slate-900/60 backdrop-blur-md border border-white/10 p-3 rounded-xl">
                  <p className="text-xs sm:text-sm font-bold text-white text-center group-hover:text-amber-400 transition">
                    {fasilitas}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}