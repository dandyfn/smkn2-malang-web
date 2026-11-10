"use client";

// Slider fasilitas: setiap aspek tampil satu layar penuh dengan foto latar,
// judul besar, dan tombol geser kiri-kanan. Bisa juga digeser (swipe) di HP
// dan memakai tombol panah keyboard.
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, BedDouble, HeartPulse, Utensils, Users, ShieldCheck, Trees, Sparkles, Phone,
} from "lucide-react";
import { KADOEA_FASILITAS, type Fasilitas } from "@/data/kadoea";

const IKON: Record<Fasilitas["ikon"], React.ElementType> = {
  bed: BedDouble, heart: HeartPulse, utensils: Utensils, users: Users,
  shield: ShieldCheck, trees: Trees, sparkles: Sparkles, phone: Phone,
};


export default function KadoeaFasilitasSlider() {
  const items = KADOEA_FASILITAS;
  const total = items.length;
  const [index, setIndex] = useState(0);
  const [arah, setArah] = useState<1 | -1>(1); // 1 = ke kanan, -1 = ke kiri (untuk arah animasi)
  const reduceMotion = useReducedMotion();
  const touchX = useRef<number | null>(null);

  const pergi = useCallback((tujuan: number, dir?: 1 | -1) => {
    setArah(dir ?? (tujuan > index ? 1 : -1));
    setIndex((tujuan + total) % total); // berputar: setelah slide terakhir kembali ke pertama
  }, [index, total]);

  const next = () => pergi(index + 1, 1);
  const prev = () => pergi(index - 1, -1);

  const item = items[index];
  const Icon = IKON[item.ikon];
  const geser = reduceMotion ? 0 : 60;

  return (
    <section
      id="fasilitas"
      aria-roledescription="carousel"
      aria-label="Fasilitas KADOEA Senior Living"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchX.current = null;
      }}
      className="relative h-[calc(100vh-5rem)] min-h-[600px] overflow-hidden bg-slate-950 outline-none"
    >
      {/* Semua foto dimuat sejak awal dan ditumpuk; yang aktif dimunculkan (memudar + sedikit membesar).
          Dengan begitu pergantian slide langsung mulus tanpa menunggu foto diunduh. */}
      {items.map((f, i) => (
        <motion.div
          key={f.nama}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0, scale: i === index || reduceMotion ? 1 : 1.08 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          aria-hidden={i !== index}
        >
          <Image src={f.foto} alt={f.nama} fill sizes="100vw" className="object-cover" loading="eager" />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        {/* Judul & deskripsi aspek, masuk dari arah geseran */}
        <AnimatePresence mode="wait" initial={false} custom={arah}>
          <motion.div
            key={item.nama}
            custom={arah}
            initial={{ opacity: 0, x: arah * geser }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -arah * geser }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="max-w-2xl"
            aria-live="polite"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-6 shadow-lg shadow-amber-400/20">
              <Icon className="w-8 h-8" />
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-white leading-[1.05] tracking-tight drop-shadow-lg">
              {item.nama}
            </h2>
            <p className="text-slate-200 text-lg sm:text-2xl leading-relaxed mt-6 drop-shadow">{item.deskripsi}</p>
          </motion.div>
        </AnimatePresence>

        {/* Tombol geser kiri-kanan */}
        <div className="mt-12 flex gap-3">
          <button
            onClick={prev}
            aria-label="Fasilitas sebelumnya"
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white flex items-center justify-center backdrop-blur transition"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={next}
            aria-label="Fasilitas berikutnya"
            className="w-14 h-14 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg transition"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Garis progres di paling bawah */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
        <motion.div
          className="h-full bg-amber-400"
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </section>
  );
}
