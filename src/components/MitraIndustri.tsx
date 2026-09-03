"use client";

import Image from "next/image";

export default function MitraIndustri() {
  const mitraList = [
    { name: "Alana", src: "/logos/alana.png" },
    { name: "Aston", src: "/logos/aston.png" },
    { name: "BIG", src: "/logos/big.png" },
    { name: "Brawijaya", src: "/logos/brawijaya.png" },
    { name: "Capoeng", src: "/logos/capoeng.png" },
    { name: "Daqu", src: "/logos/daqu.png" },
    { name: "Fave", src: "/logos/fave.png" },
    { name: "Faves", src: "/logos/faves.png" },
    { name: "Grand Mercure", src: "/logos/grandm.png" },
    { name: "Kakkoi", src: "/logos/kakkoi.png" },
    { name: "Kreasindo", src: "/logos/kreasindo.png" },
    { name: "Marugame Udon", src: "/logos/magurame.png" },
    { name: "Mejakita", src: "/logos/mejakita.png" },
    { name: "Nale", src: "/logos/nale.png" },
    { name: "Regents", src: "/logos/regents.png" },
    { name: "RSUD", src: "/logos/rsud.png" },
    { name: "Rukun Senior Living", src: "/logos/rukun.png" },
    { name: "Samsung", src: "/logos/samsung.png" },
    { name: "Sarana AI", src: "/logos/saranaai.png" },
    { name: "Servisin", src: "/logos/servisin.png" },
    { name: "TMINT", src: "/logos/tmint.png" },
    { name: "Tugu", src: "/logos/tugu.png" },
    { name: "UMM", src: "/logos/umm.png" },
    { name: "Vernon", src: "/logos/vernon.png" },
  ];

  return (
    <section id="mitra" className="relative z-30 bg-white border-y border-slate-200 py-10 shadow-xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Dipercaya oleh Mitra Industri dan Dunia Kerja (DUDI)
        </h3>
      </div>

      <div className="flex overflow-hidden select-none">
        <div className="animate-marquee flex gap-6 items-center">
          {/* Loop Pertama */}
          <div className="flex gap-6 items-center">
            {mitraList.map((mitra, index) => (
              <div
                key={`1-${index}`}
                className="w-36 h-20 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl shadow-xs flex items-center justify-center shrink-0 hover:border-slate-300 transition"
              >
                <Image
                  src={mitra.src}
                  alt={mitra.name}
                  width={120}
                  height={60}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>

          {/* Loop Kedua (Duplikasi untuk efek seamless marquee) */}
          <div className="flex gap-6 items-center">
            {mitraList.map((mitra, index) => (
              <div
                key={`2-${index}`}
                className="w-36 h-20 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl shadow-xs flex items-center justify-center shrink-0 hover:border-slate-300 transition"
              >
                <Image
                  src={mitra.src}
                  alt={mitra.name}
                  width={120}
                  height={60}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}