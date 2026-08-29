"use client";

export default function MitraIndustri() {
  const mitraList = [
    "SAMSUNG",
    "RUKUN SENIOR LIVING",
    "GRAND MERCURE",
    "MARUGAME UDON",
    "BRAWIJAYA MULTI USAHA",
    "FAVEHOTEL",
    "ASTON MALANG",
  ];

  return (
    <section id="mitra" className="relative z-30 bg-white border-y border-slate-200 py-10 shadow-xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Dipercaya oleh Mitra Industri dan Dunia Kerja (DUDI)
        </h3>
      </div>

      <div className="flex overflow-hidden select-none">
        <div className="animate-marquee flex gap-4 items-center">
          {/* Loop Pertama */}
          <div className="flex gap-4 items-center text-slate-800 font-extrabold text-xs">
            {mitraList.map((mitra, index) => (
              <span
                key={`1-${index}`}
                className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm whitespace-nowrap"
              >
                {mitra}
              </span>
            ))}
          </div>

          {/* Loop Kedua (Duplikasi untuk efek seamless loop) */}
          <div className="flex gap-4 items-center text-slate-800 font-extrabold text-xs">
            {mitraList.map((mitra, index) => (
              <span
                key={`2-${index}`}
                className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm whitespace-nowrap"
              >
                {mitra}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}