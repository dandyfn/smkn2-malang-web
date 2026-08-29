"use client";

import { Quote } from "lucide-react";

export default function Sambutan() {
  return (
    <section className="sticky top-0 z-10 min-h-screen bg-slate-100 text-slate-900 py-24 px-6 flex items-center justify-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 items-center">
        {/* Card Foto Kepala Sekolah */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl text-center">
            <div className="w-full h-72 bg-slate-200 rounded-2xl mb-4 flex items-center justify-center text-slate-400 font-semibold border border-slate-300">
              [ Foto Kepala Sekolah ]
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">
              Bapak Slamet Winarto, M.Pd
            </h4>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">
              Kepala SMKN 2 Malang
            </p>
          </div>
        </div>

        {/* Teks Sambutan & Quote */}
        <div className="md:col-span-7 space-y-4">
          <span className="inline-block text-xs font-black text-amber-600 bg-amber-100 border border-amber-300 px-3 py-1 rounded-md uppercase tracking-wider">
            Pesan Pimpinan
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            Selamat Datang di Portal Resmi SMKN 2 Malang
          </h3>

          <div className="bg-white border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm flex gap-3 items-start">
            <Quote className="w-8 h-8 text-amber-500 shrink-0 rotate-180" />
            <p className="text-slate-700 italic text-sm leading-relaxed">
              "Menyiapkan generasi masa depan tidak hanya soal keterampilan teknis, melainkan pembentukan karakter yang adaptif dan berintegritas."
            </p>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            Perkembangan teknologi mendorong kami untuk terus bertransformasi menyajikan layanan pendidikan transparan, modern, dan mudah diakses oleh seluruh stakeholder.
          </p>
        </div>
      </div>
    </section>
  );
}