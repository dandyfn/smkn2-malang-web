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

      // Hitung progress saat track mulai terkunci di top <= 0
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
    // Track panjang 250vh untuk memberi ruang scroll horizontal
    <div ref={trackRef} className="relative h-[250vh] w-full bg-slate-950">
      {/* Sticky Container Tepat Mengunci di Top 0 Layar */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-30">
        
        {/* Layer 1: Testimoni (Diam di belakang) */}
        <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
          <Testimoni />
        </div>

        {/* Layer 2: Pusat Informasi FAQ (Meluncur Horizontal Menutupi Testimoni) */}
        <section
          style={{
            transform: `translate3d(${translateX}%, 0px, 0px)`,
            willChange: "transform",
          }}
          className="absolute inset-0 w-full h-full bg-slate-950 text-white px-6 flex flex-col justify-center z-20 shadow-[-30px_0_60px_rgba(0,0,0,0.95)]"
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