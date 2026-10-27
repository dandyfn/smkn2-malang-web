"use client";

// src/components/NeuralNetworkBackground.tsx
// Background "neural network" interaktif: titik-titik bergerak, tersambung bila berdekatan,
// dan tersambung ke kursor mouse. Tampilan bawaan sama dengan halaman ekstrakurikuler.
//
// Cara pakai (contoh):
//   <div className="min-h-screen flex flex-col bg-white relative overflow-x-hidden">
//     <NeuralNetworkBackground />
//     <Header />
//     <main className="relative z-10 ...">...</main>
//   </div>

import { useEffect, useRef } from "react";

type Props = {
  /** Warna dalam format "r, g, b". Bawaan: #251FBC = "37, 31, 188".
   *  Contoh: kuning "217, 119, 6", biru terang untuk latar gelap "96, 165, 250". */
  color?: string;
  /** Jarak maksimum dua titik agar tersambung (px). */
  maxDistance?: number;
  /** Jangkauan kursor mouse (px). */
  mouseRadius?: number;
  /** Luas layar (px²) per satu titik. Makin besar angkanya, makin jarang titiknya. */
  density?: number;
  /** Kelas CSS untuk kanvas. Bawaan menempel penuh di layar dan tidak ikut bergulir. */
  className?: string;
};

type NodeDot = { x: number; y: number; vx: number; vy: number; r: number };

const MAX_NODES = 220; // batas pengaman supaya layar sangat besar tetap ringan

export default function NeuralNetworkBackground({
  color = "37, 31, 188",
  maxDistance = 130,
  mouseRadius = 180,
  density = 12000,
  className = "fixed inset-0 pointer-events-none z-0",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let rafId = 0;

    // Resolusi mengikuti kepadatan piksel layar agar garis tetap tajam (maks 2x)
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const mouse = { x: -1000, y: -1000 };

    const count = Math.min(MAX_NODES, Math.floor((width * height) / density));
    const nodes: NodeDot[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 2 + 1.5,
    }));

    const maxSq = maxDistance * maxDistance;

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Titik
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.75)`;
        ctx.fill();

        // Garis ke titik lain yang berdekatan
        for (let j = i + 1; j < nodes.length; j++) {
          const o = nodes[j];
          const dx = n.x - o.x;
          const dy = n.y - o.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxSq) {
            const alpha = (1 - Math.sqrt(d2) / maxDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Garis ke kursor mouse
        const dxm = n.x - mouse.x;
        const dym = n.y - mouse.y;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < mouseRadius) {
          const alpha = (1 - dm / mouseRadius) * 0.55;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${color}, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      step();
      draw();
      rafId = requestAnimationFrame(animate);
    };

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      // Abaikan perubahan tinggi kecil (misalnya bilah alamat browser HP yang naik-turun)
      if (nw === width && Math.abs(nh - height) < 150) return;
      const sx = nw / width;
      const sy = nh / height;
      for (const n of nodes) {
        n.x *= sx;
        n.y *= sy;
      }
      width = nw;
      height = nh;
      setSize();
      if (reduceMotion) draw();
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", onResize);
    if (!reduceMotion) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);
      animate();
    } else {
      draw(); // pengguna meminta gerakan dikurangi: tampilkan satu gambar diam
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [color, maxDistance, mouseRadius, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}