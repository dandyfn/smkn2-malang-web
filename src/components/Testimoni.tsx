"use client";

import { Star } from "lucide-react";

export default function Testimoni() {
  const reviews = [
    {
      ulasan:
        '"SMKN 2 Malang tempat belajarnya sangat mendukung dan fasilitas memadai untuk sekolah kejuruan..."',
      rating: 5,
    },
    {
      ulasan:
        '"SMK dgn konsentrasi bbrp ilmu,antara lain Jasa Boga, Perhotelan, Travel, Computer dll..."',
      rating: 5,
    },
    {
      ulasan:
        '"Yang pasti disini ada banyak macam jurusan ya ada perhotelan, keperawatan, teknik komputer..."',
      rating: 5,
    },
  ];

  return (
    <div className="w-full h-full bg-white text-slate-900 py-20 px-6 flex flex-col justify-center items-center">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block mb-3">
            Ulasan Publik
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kepercayaan Publik yang Terverifikasi
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Ulasan langsung dari Google Maps tanpa manipulasi.
          </p>
        </div>

        {/* Grid Kartu Ulasan Google */}
        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-slate-50/70 border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-xs hover:border-slate-300 transition"
            >
              <div>
                {/* Logo Google & Star Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-blue-600 text-base tracking-tight">
                    Google
                  </span>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Teks Ulasan */}
                <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed">
                  {rev.ulasan}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}