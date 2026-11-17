"use client";

// Latar "neural network" section FAQ Sumitra.
// - Titik toska & amber bergerak pelan di dalam section (bukan seluruh layar).
// - Saat kursor (atau jari di HP) mendekat, titik di sekitarnya tersambung ke kursor
//   dan saling tersambung satu sama lain; makin dekat, garisnya makin tebal.
// - Berhenti beranimasi bila pengunjung memilih "kurangi gerakan" di perangkatnya.
import { useEffect, useRef } from "react";

type Titik = { x: number; y: number; vx: number; vy: number; r: number; amber: boolean };

const TOSKA = "15, 118, 110";
const AMBER = "245, 158, 11";
const JARAK_SAMBUNG = 120; // jarak antartitik agar tersambung samar
const JANGKAUAN_KURSOR = 190; // jangkauan kursor
const LUAS_PER_TITIK = 14000;

export default function JaringFaq() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wadah = canvas?.parentElement;
    if (!canvas || !wadah) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lebar = wadah.clientWidth;
    let tinggi = wadah.clientHeight;
    let titik: Titik[] = [];
    let raf = 0;
    const kursor = { x: -9999, y: -9999, aktif: false };

    const buatTitik = () => {
      const n = Math.min(140, Math.max(24, Math.floor((lebar * tinggi) / LUAS_PER_TITIK)));
      titik = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * lebar,
        y: Math.random() * tinggi,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: i % 4 === 0 ? 3.2 : 2.2,
        amber: i % 4 === 0,
      }));
    };

    const aturUkuran = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(lebar * dpr);
      canvas.height = Math.floor(tinggi * dpr);
      canvas.style.width = `${lebar}px`;
      canvas.style.height = `${tinggi}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const gambar = () => {
      ctx.clearRect(0, 0, lebar, tinggi);
      const sambungSq = JARAK_SAMBUNG * JARAK_SAMBUNG;

      // jarak tiap titik ke kursor (dipakai berkali-kali)
      const dekat = titik.map((t) => (kursor.aktif ? Math.hypot(t.x - kursor.x, t.y - kursor.y) : Infinity));

      for (let i = 0; i < titik.length; i++) {
        const a = titik[i];
        for (let j = i + 1; j < titik.length; j++) {
          const b = titik[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const keduanyaDekatKursor = dekat[i] < JANGKAUAN_KURSOR && dekat[j] < JANGKAUAN_KURSOR;
          // Di sekitar kursor, titik saling tersambung walau sedikit lebih jauh
          const batas = keduanyaDekatKursor ? sambungSq * 2.2 : sambungSq;
          if (d2 < batas) {
            const d = Math.sqrt(d2);
            const kuat = keduanyaDekatKursor ? 1 - Math.max(dekat[i], dekat[j]) / JANGKAUAN_KURSOR : 0;
            const alpha = (1 - d / Math.sqrt(batas)) * (0.16 + kuat * 0.55);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${TOSKA}, ${alpha})`;
            ctx.lineWidth = 1 + kuat * 1.4;
            ctx.stroke();
          }
        }
        // garis ke kursor
        if (dekat[i] < JANGKAUAN_KURSOR) {
          const kuat = 1 - dekat[i] / JANGKAUAN_KURSOR;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(kursor.x, kursor.y);
          ctx.strokeStyle = `rgba(${a.amber ? AMBER : TOSKA}, ${kuat * 0.7})`;
          ctx.lineWidth = 1 + kuat * 1.6;
          ctx.stroke();
        }
      }

      for (let i = 0; i < titik.length; i++) {
        const t = titik[i];
        const sorot = dekat[i] < JANGKAUAN_KURSOR ? 1 - dekat[i] / JANGKAUAN_KURSOR : 0;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r + sorot * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${t.amber ? AMBER : TOSKA}, ${0.55 + sorot * 0.4})`;
        ctx.fill();
      }
    };

    const langkah = () => {
      for (const t of titik) {
        t.x += t.vx;
        t.y += t.vy;
        if (t.x < 0 || t.x > lebar) t.vx *= -1;
        if (t.y < 0 || t.y > tinggi) t.vy *= -1;
      }
    };

    const animasi = () => {
      langkah();
      gambar();
      raf = requestAnimationFrame(animasi);
    };

    // Posisi kursor relatif terhadap section
    const gerak = (e: PointerEvent) => {
      const kotak = wadah.getBoundingClientRect();
      kursor.x = e.clientX - kotak.left;
      kursor.y = e.clientY - kotak.top;
      kursor.aktif = true;
      if (kurangiGerak) gambar();
    };
    const keluar = () => {
      kursor.aktif = false;
      if (kurangiGerak) gambar();
    };

    const amati = new ResizeObserver(() => {
      const lb = wadah.clientWidth;
      const tg = wadah.clientHeight;
      if (lb === lebar && tg === tinggi && titik.length) return;
      const sx = lebar ? lb / lebar : 1;
      const sy = tinggi ? tg / tinggi : 1;
      lebar = lb;
      tinggi = tg;
      aturUkuran();
      if (!titik.length) buatTitik();
      else for (const t of titik) { t.x *= sx; t.y *= sy; }
      if (kurangiGerak) gambar();
    });

    aturUkuran();
    buatTitik();
    amati.observe(wadah);
    wadah.addEventListener("pointermove", gerak);
    wadah.addEventListener("pointerdown", gerak);
    wadah.addEventListener("pointerleave", keluar);
    wadah.addEventListener("pointercancel", keluar);

    // Hemat baterai: animasi hanya berjalan saat section terlihat di layar
    let terlihat = false;
    const pantau = new IntersectionObserver(([en]) => {
      if (kurangiGerak) return;
      if (en.isIntersecting && !terlihat) {
        terlihat = true;
        animasi();
      } else if (!en.isIntersecting && terlihat) {
        terlihat = false;
        cancelAnimationFrame(raf);
      }
    });
    pantau.observe(wadah);
    if (kurangiGerak) gambar();

    return () => {
      cancelAnimationFrame(raf);
      amati.disconnect();
      pantau.disconnect();
      wadah.removeEventListener("pointermove", gerak);
      wadah.removeEventListener("pointerdown", gerak);
      wadah.removeEventListener("pointerleave", keluar);
      wadah.removeEventListener("pointercancel", keluar);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" />;
}
