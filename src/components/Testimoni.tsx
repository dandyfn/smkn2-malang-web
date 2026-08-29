"use client";

import { Star } from "lucide-react";

export default function Testimoni() {
  const reviews = [
    {
      nama: "Rizky Pratama",
      role: "Alumni TKJ - Software Engineer",
      ulasan: "Fasilitas lab di SMKN 2 Malang sangat memadai. Pembelajaran berbasis proyek langsung menyiapkan saya masuk ke dunia industri.",
      rating: 5,
    },
    {
      nama: "Siti Nurhaliza",
      role: "Alumni Perhotelan - Front Office Staff",
      ulasan: "Penyaluran kerja lewat BKK sangat membantu. Sebelum lulus sudah dapat kesempatan magang dan kerja di hotel berbintang.",
      rating: 5,
    },
    {
      nama: "Budi Santoso",
      role: "Wali Murid",
      ulasan: "Kedisiplinan dan pembentukan karakter siswanya sangat luar biasa. Lingkungan sekolah bersih, asri, dan aman.",
      rating: 5,
    },
  ];

  return (
    <section className="sticky top-0 z-20 min-h-screen bg-slate-900 text-white py-24 px-6 flex flex-col justify-center border-b border-slate-800">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full inline-block mb-3">
            Ulasan Publik
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            Apa Kata Mereka Tentang SMKN 2 Malang?
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                  "{rev.ulasan}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700/60">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                  {rev.nama.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{rev.nama}</h4>
                  <p className="text-xs text-slate-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}