"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Hitung progress hanya ketika bagian ini mulai masuk viewport
      const totalScrollable = rect.height - windowHeight;
      const currentScroll = -rect.top;

      let p = currentScroll / totalScrollable;
      p = Math.max(0, Math.min(1, p)); // Batasi rentang 0 sampai 1
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqs = [
    {
      q: "Kapan pendaftaran PPDB SMKN 2 Malang dibuka?",
      a: "Pendaftaran PPDB biasanya dibuka sesuai dengan jadwal resmi Dinas Pendidikan Jawa Timur sekitar bulan Mei–Juni setiap tahunnya.",
    },
    {
      q: "Apa saja konsentrasi keahlian yang ada di SMKN 2 Malang?",
      a: "Terdapat 6 konsentrasi keahlian: Perhotelan, Kuliner, Pekerjaan Sosial (PKS), Keperawatan & Caregiver, Usaha Layanan Wisata (ULW), serta Teknik Komputer & Jaringan (TKJ).",
    },
    {
      q: "Bagaimana cara kerja Bursa Kerja Khusus (BKK)?",
      a: "BKK SMKN 2 Malang memfasilitasi rekruitmen langsung dari perusahaan mitra DUDI untuk alumni dan siswa tingkat akhir.",
    },
  ];

  // Pergeseran Murni Horizontal: 100% (luar kanan) -> 0% (menutup sempurna)
  const translateX = (1 - progress) * 100;

  return (
    <div ref={containerRef} className="relative z-40 h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <section
          style={{
            transform: `translateX(${translateX}%)`,
          }}
          id="faq"
          className="w-full h-full bg-slate-950 text-white px-6 flex flex-col justify-center border-l-4 border-amber-400 shadow-[-30px_0_60px_rgba(0,0,0,0.95)]"
        >
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-3xl sm:text-4xl font-black text-white">
                Pusat Informasi & FAQ
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Pertanyaan yang paling sering ditanyakan seputar SMKN 2 Malang
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full text-left p-5 font-bold text-white text-sm sm:text-base flex justify-between items-center gap-4 hover:text-amber-400 transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}