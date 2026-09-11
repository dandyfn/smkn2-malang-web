"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Testimoni from "@/components/Testimoni";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [progress, setProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDistance = rect.height - windowHeight;

      if (totalDistance <= 0) return;

      const currentPosition = -rect.top;
      let p = currentPosition / totalDistance;
      p = Math.max(0, Math.min(1, p));

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

  const translateX = (1 - progress) * 100;

  return (
    <div ref={trackRef} className="relative h-[250vh] w-full bg-slate-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden z-30">
        
        {/* Layer 1: Testimoni */}
        <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
          <Testimoni />
        </div>

        {/* Layer 2: Pusat Informasi FAQ */}
        <section
          style={{
            transform: `translate3d(${translateX}%, 0px, 0px)`,
            willChange: "transform",
          }}
          className="absolute inset-0 w-full h-full text-white px-6 flex flex-col justify-center z-20 shadow-[-30px_0_60px_rgba(0,0,0,0.95)] overflow-hidden"
        >
          {/* GAMBAR BACKGROUND */}
          <img
            src="/images/bgpusatinfo.jpg"
            alt="Background Pusat Informasi"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* OVERLAY DENGAN KEGELAPAN DITURUNKAN (Sangat terang dan gambar terlihat jelas) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60 backdrop-blur-[2px] z-0" />

          {/* KONTEN FAQ */}
          <div className="max-w-4xl mx-auto w-full relative z-10">
            <div className="text-center mb-10 drop-shadow-md">
              <HelpCircle className="w-10 h-10 text-amber-400 mx-auto mb-3 drop-shadow" />
              <h3 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md">
                Pusat Informasi & FAQ
              </h3>
              <p className="text-slate-200 text-sm mt-2 font-medium drop-shadow">
                Pertanyaan yang paling sering ditanyakan seputar SMKN 2 Malang
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-slate-950/80 border border-slate-700/60 rounded-2xl overflow-hidden transition backdrop-blur-md shadow-2xl"
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
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-slate-800/80 pt-3">
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