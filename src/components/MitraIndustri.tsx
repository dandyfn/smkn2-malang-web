"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

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

// Waktu (detik) untuk satu putaran penuh. Angka lebih besar = lebih lambat.
const DURASI_PUTARAN = 20;

export default function MitraIndustri() {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const setengahLebar = useRef(0);
  const dijeda = useRef(false);

  // Ukur lebar satu salinan daftar logo (setengah dari total track)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ukur = () => {
      setengahLebar.current = el.scrollWidth / 2;
    };
    ukur();
    const observer = new ResizeObserver(ukur);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Geser track setiap frame; kembali ke awal saat satu salinan lewat
  useAnimationFrame((_, delta) => {
    const lebar = setengahLebar.current;
    if (reduceMotion || dijeda.current || lebar === 0) return;

    const langkah = (lebar / (DURASI_PUTARAN * 1000)) * Math.min(delta, 50);
    let berikutnya = x.get() - langkah;
    if (berikutnya <= -lebar) berikutnya += lebar;
    x.set(berikutnya);
  });

  return (
    <section
      id="mitra"
      className="relative z-30 bg-white border-y border-slate-200 py-10 shadow-xl overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 text-center mb-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Dipercaya oleh Mitra Industri dan Dunia Kerja (DUDI)
        </h3>
      </div>

      <div
        className="flex overflow-hidden motion-reduce:overflow-x-auto select-none"
        onMouseEnter={() => {
          dijeda.current = true;
        }}
        onMouseLeave={() => {
          dijeda.current = false;
        }}
      >
        <motion.div ref={trackRef} style={{ x }} className="flex w-max">
          {[0, 1].map((salinan) => (
            <div
              key={salinan}
              // Salinan kedua hanya untuk efek loop, disembunyikan dari pembaca layar
              aria-hidden={salinan === 1}
              className="flex gap-6 items-center pr-6"
            >
              {mitraList.map((mitra) => (
                <div
                  key={mitra.name}
                  className="w-36 h-20 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl shadow-xs flex items-center justify-center shrink-0 hover:border-slate-300 transition"
                >
                  <Image
                    src={mitra.src}
                    alt={salinan === 0 ? mitra.name : ""}
                    width={120}
                    height={60}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}