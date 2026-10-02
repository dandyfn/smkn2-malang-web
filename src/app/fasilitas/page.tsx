"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DATA_FASILITAS } from "@/data/fasilitas";
import { Sparkles, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";

// KOMPONEN BACKGROUND GRID PERSEGI INTERAKTIF (Kuning #FCFC4A -> Memutih dekat kursor)
function SquareGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Posisi mouse & radius jangkauan efek
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 350, // Jangkauan area efek memutih
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const tileSize = 45; // Ukuran kotak persegi

    // WARNA DASAR: Hex #FCFC4A (RGB: 252, 252, 74)
    const baseR = 252;
    const baseG = 252;
    const baseB = 74;

    // WARNA TARGET KURSOR: Putih Murni (RGB: 255, 255, 255)
    const targetR = 255;
    const targetG = 255;
    const targetB = 255;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / tileSize);
      const rows = Math.ceil(height / tileSize);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * tileSize;
          const y = r * tileSize;

          const centerX = x + tileSize / 2;
          const centerY = y + tileSize / 2;

          const dx = centerX - mouse.x;
          const dy = centerY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Proximity linear (0 = jauh, 1 = tepat di kursor)
          let proximity = 0;
          if (dist < mouse.radius) {
            proximity = 1 - dist / mouse.radius;
          }

          // Transisi warna halus menuju putih tanpa efek menggelap
          const whiteFactor = Math.pow(proximity, 1.2);

          // Interpolasi Linear: Murni dari #FCFC4A -> #FFFFFF
          const red = Math.round(baseR + (targetR - baseR) * whiteFactor);
          const green = Math.round(baseG + (targetG - baseG) * whiteFactor);
          const blue = Math.round(baseB + (targetB - baseB) * whiteFactor);

          // Transparansi isi: Kotak jauh 0.12, makin dekat kursor makin terang (0.95)
          const fillAlpha = 0.12 + whiteFactor * 0.83;

          // 1. ISI WARNA KOTAK GRID
          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${fillAlpha})`;
          ctx.fillRect(x, y, tileSize, tileSize);

          // 2. GARIS PEMBATAS KOTAK GRID
          const borderAlpha = 0.3 + whiteFactor * 0.6;
          ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${borderAlpha})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

export default function FasilitasPage() {
  const [fasilitasAktif, setFasilitasAktif] = useState(DATA_FASILITAS[0]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 relative overflow-x-hidden">
      {/* BACKGROUND SQUARE GRID INTERAKTIF */}
      <SquareGridBackground />

      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-10 max-w-[1500px] mx-auto space-y-10 z-10 relative">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-4">
          <span className="text-xs font-black uppercase tracking-widest bg-amber-400/10 text-amber-600 border border-amber-400/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> SARANA & PRASARANA
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            Fasilitas <span className="text-amber-500">SMKN 2 Malang</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Mendukung proses belajar mengajar, kesehatan, serta kenyamanan seluruh warga sekolah dengan sarana terintegrasi.
          </p>
        </div>

        {/* SPLIT SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* MENU KIRI (NAVIGATION PANEL) */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-900 rounded-3xl p-3 sm:p-4 space-y-1.5 backdrop-blur-md sticky top-24 shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-2">
              Pilih Fasilitas
            </p>
            {DATA_FASILITAS.map((item) => {
              const isSelected = fasilitasAktif.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setFasilitasAktif(item)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isSelected
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 translate-x-1"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <span>{item.nama}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "rotate-90 text-slate-950" : "text-slate-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* DISPLAY KANAN (THE STAGE) */}
          <div className="lg:col-span-8 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl relative min-h-[550px] flex flex-col justify-between">
            
            {/* LARGE BANNER GAMBAR */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-t-3xl">
              <img
                src={fasilitasAktif.gambar}
                alt={fasilitasAktif.nama}
                className="w-full h-full object-cover transition-all duration-700 scale-100 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* BADGE DI ATAS FOTO */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-slate-900/90 border border-slate-800 text-amber-400 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-bold shadow-md">
                  {fasilitasAktif.nama}
                </span>
              </div>
            </div>

            {/* DETAIL CONTENT BELOW PHOTO */}
            <div className="p-6 sm:p-10 space-y-6 relative z-10 -mt-20 bg-slate-950/95 backdrop-blur-md border-t border-slate-900 rounded-t-3xl">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {fasilitasAktif.nama}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-amber-400">
                  {fasilitasAktif.tagline}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pt-2">
                  {fasilitasAktif.deskripsi}
                </p>
              </div>

              {/* FITUR UTAMA HIGHLIGHTS */}
              <div className="pt-2 border-t border-slate-900 space-y-3">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Keunggulan Sarana
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {fasilitasAktif.fiturUtama.map((fitur, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-medium text-slate-200">{fitur}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}