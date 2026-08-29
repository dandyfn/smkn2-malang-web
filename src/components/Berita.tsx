"use client";

import { ArrowRight, Calendar } from "lucide-react";

export default function Berita() {
  const beritaList = [
    {
      kategori: "Berita",
      judul: "SMKN 2 Malang Tetapkan Komitmen Sekolah Asri",
      deskripsi: "Mewujudkan lingkungan belajar yang sehat, hijau, dan kondusif bagi seluruh siswa.",
      tanggal: "28 Agu 2026",
    },
    {
      kategori: "Kegiatan",
      judul: "Petugas Upacara Raih Apresiasi Positif",
      deskripsi: "Performa luar biasa dan penuh kedisiplinan dari tim Paskibra sekolah.",
      tanggal: "25 Agu 2026",
    },
    {
      kategori: "Industri",
      judul: "Kunjungan Industri ke Grand Mercure",
      deskripsi: "Mengenalkan standar kerja hospitality bintang lima secara langsung kepada siswa.",
      tanggal: "20 Agu 2026",
    },
  ];

  return (
    <section id="berita" className="relative z-20 bg-slate-900 text-white py-24 px-6 border-b border-slate-800 shadow-[0_-30px_60px_rgba(0,0,0,0.9)]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Kabar Kampus
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Berita Terbaru
            </h3>
          </div>
          <a href="#" className="text-amber-400 font-bold text-sm hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {beritaList.map((item, index) => (
            <div key={index} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl hover:border-amber-400/50 transition duration-300">
              <div className="h-44 bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-semibold">
                [ Foto {item.judul.slice(0, 20)}... ]
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    {item.kategori}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.tanggal}
                  </span>
                </div>
                <h4 className="font-bold text-white text-base leading-snug hover:text-amber-400 transition cursor-pointer">
                  {item.judul}
                </h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}