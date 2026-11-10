"use client";

// Efek "ditelan": section Tentang terkunci (sticky) saat sudah di atas layar,
// lalu section Paket naik menutupinya. Tentang perlahan mengecil dan menggelap.
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export default function KadoeaStack({ atas, bawah }: { atas: React.ReactNode; bawah: React.ReactNode }) {
  const atasRef = useRef<HTMLDivElement>(null);
  const bawahRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [top, setTop] = useState(80);

  // Posisi kunci: tepat di bawah header. Jika section Tentang lebih tinggi dari layar (misalnya di HP),
  // kunci saat bagian BAWAHNYA menyentuh dasar layar supaya isinya tetap terbaca semua.
  useEffect(() => {
    const el = atasRef.current;
    if (!el) return;
    const hitung = () => {
      const header = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
      setTop(Math.min(header, window.innerHeight - el.offsetHeight));
    };
    hitung();
    const ro = new ResizeObserver(hitung);
    ro.observe(el);
    window.addEventListener("resize", hitung);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", hitung);
    };
  }, []);

  // 0 = Paket baru muncul dari bawah layar, 1 = Paket sudah menutupi penuh
  const { scrollYProgress } = useScroll({ target: bawahRef, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.9]);
  const gelap = useTransform(scrollYProgress, [0, 1], [0, 0.75]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 32]);

  return (
    <div className="relative">
      <div ref={atasRef} className="sticky z-0" style={{ top }}>
        <motion.div style={{ scale, borderRadius: radius }} className="origin-top overflow-hidden">
          {atas}
        </motion.div>
        {/* Lapisan gelap yang makin pekat saat Paket menutupi */}
        <motion.div style={{ opacity: gelap }} className="absolute inset-0 bg-slate-950 pointer-events-none" />
      </div>

      <div
        ref={bawahRef}
        className="relative z-10 rounded-t-[2.5rem] overflow-hidden shadow-[0_-30px_60px_rgba(2,6,23,0.45)]"
      >
        {bawah}
      </div>
    </div>
  );
}
