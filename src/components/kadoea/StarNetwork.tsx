"use client";

// Latar "neural link" dengan titik berbentuk bintang.
// Mengikuti ukuran elemen induknya (bukan seluruh layar), jadi cocok untuk latar satu section.
// Induknya wajib memakai class "relative".
import { useEffect, useRef } from "react";

type Props = {
  starColor?: string; // "r, g, b"
  lineColor?: string; // "r, g, b"
  maxDistance?: number;
  mouseRadius?: number;
  density?: number; // luas (px²) per satu bintang
};

type Bintang = { x: number; y: number; vx: number; vy: number; r: number; rot: number; spin: number };

// Gambar bintang 5 sudut di titik (x, y)
function gambarBintang(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45; // sudut luar dan dalam bergantian
    const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export default function StarNetwork({
  starColor = "245, 158, 11",
  lineColor = "30, 58, 138",
  maxDistance = 140,
  mouseRadius = 180,
  density = 14000,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = parent.clientWidth;
    let height = parent.clientHeight;
    let rafId = 0;
    let terlihat = false;
    const mouse = { x: -1000, y: -1000 };

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const buat = (): Bintang[] =>
      Array.from({ length: Math.min(160, Math.floor((width * height) / density)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 3 + 3,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.01,
      }));
    let stars = buat();
    const maxSq = maxDistance * maxDistance;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const o = stars[j];
          const dx = s.x - o.x, dy = s.y - o.y, d2 = dx * dx + dy * dy;
          if (d2 < maxSq) {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${(1 - Math.sqrt(d2) / maxDistance) * 0.25})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        const dm = Math.hypot(s.x - mouse.x, s.y - mouse.y);
        if (dm < mouseRadius) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${starColor}, ${(1 - dm / mouseRadius) * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        gambarBintang(ctx, s.x, s.y, s.r, s.rot);
        ctx.fillStyle = `rgba(${starColor}, 0.85)`;
        ctx.fill();
      }
    };

    const animate = () => {
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.spin;
        if (s.x < 0 || s.x > width) s.vx *= -1;
        if (s.y < 0 || s.y > height) s.vy *= -1;
      }
      draw();
      if (terlihat) rafId = requestAnimationFrame(animate);
    };

    // Animasi hanya berjalan saat section terlihat di layar (hemat baterai)
    const io = new IntersectionObserver(([entry]) => {
      terlihat = entry.isIntersecting;
      cancelAnimationFrame(rafId);
      if (terlihat && !reduceMotion) rafId = requestAnimationFrame(animate);
    });
    io.observe(parent);

    const ro = new ResizeObserver(() => {
      const nw = parent.clientWidth, nh = parent.clientHeight;
      if (nw === width && nh === height) return;
      width = nw;
      height = nh;
      setSize();
      stars = buat();
      draw();
    });
    ro.observe(parent);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000; };
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    draw();

    return () => {
      io.disconnect();
      ro.disconnect();
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [starColor, lineColor, maxDistance, mouseRadius, density]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
