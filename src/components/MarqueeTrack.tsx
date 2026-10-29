"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

type MarqueeTrackProps = {
  children: ReactNode;
  /** Waktu (detik) untuk satu putaran penuh. Lebih besar = lebih lambat. */
  duration?: number;
};

export default function MarqueeTrack({ children, duration = 35 }: MarqueeTrackProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const setengahLebar = useRef(0);
  const dijeda = useRef(false);

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

  useAnimationFrame((_, delta) => {
    const lebar = setengahLebar.current;
    if (reduceMotion || dijeda.current || lebar === 0) return;

    const langkah = (lebar / (duration * 1000)) * Math.min(delta, 50);
    let berikutnya = x.get() - langkah;
    if (berikutnya <= -lebar) berikutnya += lebar;
    x.set(berikutnya);
  });

  return (
    <div
      className={reduceMotion ? "flex overflow-x-auto" : "flex overflow-hidden"}
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
            aria-hidden={salinan === 1}
            className="flex gap-6 pr-6"
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}