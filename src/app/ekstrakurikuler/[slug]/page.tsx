"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DATA_EKSTRAKURIKULER } from "@/data/ekstrakurikuler";
import { ArrowLeft, Calendar, MapPin, User, BookOpen, Images } from "lucide-react";

// KOMPONEN BACKGROUND NEURAL NETWORK ANIMASI (Warna Kustom: #251FBC)
function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Posisi awal Mouse (di luar layar)
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180, // Jangkauan pergerakan mouse
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

    // Membuat node/titik-titik
    const nodeCount = Math.floor((width * height) / 12000);
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5,
      });
    }

    // Loop animasi
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Gambar Titik (Nodes)
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Pantulan saat menabrak batas layar
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Gambar titik menggunakan warna Hex #251FBC (RGB: 37, 31, 188)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 31, 188, 0.75)";
        ctx.fill();

        // Hubungkan antar titik
        for (let j = i + 1; j < nodes.length; j++) {
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 130;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            const alpha = (1 - distance / maxDistance) * 0.35;
            ctx.strokeStyle = `rgba(37, 31, 188, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Hubungkan titik ke pergerakan MOUSE
        const dxMouse = node.x - mouse.x;
        const dyMouse = node.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          const alphaMouse = (1 - distMouse / mouse.radius) * 0.55;
          ctx.strokeStyle = `rgba(37, 31, 188, ${alphaMouse})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

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

export default function DetailEkstrakurikulerPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // MENCARI DATA EKSKUL SESUAI SLUG URL
  const ekskul = DATA_EKSTRAKURIKULER.find((item) => item.slug === slug);

  // EFEK KEMIRINGAN FOTO GALERI ESTETIK
  const tiltStyles = [
    "-rotate-6 hover:rotate-0 hover:scale-105 z-10",
    "rotate-3 hover:rotate-0 hover:scale-105 z-20 translate-y-2",
    "-rotate-3 hover:rotate-0 hover:scale-105 z-10 -translate-y-1",
    "rotate-6 hover:rotate-0 hover:scale-105 z-20",
  ];

  // JIKA DATA TIDAK DITEMUKAN
  if (!ekskul) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-800 relative overflow-x-hidden">
        <NeuralNetworkBackground />
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 relative">
          <h1 className="text-2xl font-bold text-slate-900">Ekstrakurikuler Tidak Ditemukan</h1>
          <p className="text-slate-500 text-sm">Halaman ekstrakurikuler yang kamu cari tidak ada atau telah dipindahkan.</p>
          <Link
            href="/ekstrakurikuler"
            className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600 transition"
          >
            Kembali ke Katalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 relative overflow-x-hidden">
      {/* BACKGROUND NEURAL NETWORK INTERAKTIF (#251FBC) */}
      <NeuralNetworkBackground />

      <Header />

      {/* CONTAINER FULL WIDTH */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-8 max-w-[1600px] mx-auto space-y-8 z-10 relative">
        
        {/* TOMBOL KEMBALI */}
        <div>
          <Link
            href="/ekstrakurikuler"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Ekstrakurikuler</span>
          </Link>
        </div>

        {/* HERO BANNER DINAMIS */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-4 max-w-3xl z-10">
            <span className="text-xs font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full inline-block">
              {ekskul.kategori}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {ekskul.nama}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {ekskul.deskripsi || "Ekstrakurikuler unggulan SMKN 2 Malang untuk mengembangkan minat, bakat, serta kedisiplinan siswa."}
            </p>
          </div>

          {/* INFORMASI RINGKAS */}
          <div className="bg-slate-800/80 border border-slate-700/60 backdrop-blur-md p-5 rounded-2xl w-full lg:w-80 shrink-0 space-y-3 text-xs z-10">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400">Pembina Ekskul</p>
                <p className="font-bold text-slate-100">{ekskul.pembina}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400">Jadwal Latihan</p>
                <p className="font-bold text-slate-100">{ekskul.hari.join(", ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-400">Lokasi Latihan</p>
                <p className="font-bold text-slate-100">{ekskul.lokasi}</p>
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT GRID DUA KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI (PROGRAM & AGENDA LATIHAN SEBAGAI DESKRIPSI) - 7 KOLOM */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" /> Program & Agenda Latihan
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {ekskul.deskripsi ||
                  "Program dan agenda latihan dirancang secara terstruktur untuk mengasah kemampuan teknis, pembentukan karakter, kepemimpinan, serta kerja sama tim siswa SMKN 2 Malang secara berkelanjutan."}
              </p>
            </div>
          </div>

          {/* KOLOM KANAN (GALERI FOTO MIRING ESTETIK) - 5 KOLOM */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <Images className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-extrabold text-slate-900">Galeri Kegiatan</h2>
            </div>
            
            {/* GRID GALERI POLAROID ESTETIK */}
            <div className="grid grid-cols-2 gap-4 pt-4 pb-6">
              {[1, 2, 3, 4].map((item, idx) => (
                <div
                  key={idx}
                  className={`relative bg-white p-2.5 rounded-2xl shadow-md border border-slate-200 transition-all duration-300 transform cursor-pointer ${
                    tiltStyles[idx % tiltStyles.length]
                  }`}
                >
                  <div className="h-36 sm:h-44 w-full rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={(ekskul as any).gambar || "/images/smkn2logo.png"}
                      alt={`Dokumentasi ${ekskul.nama}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 text-center mt-2 tracking-wider uppercase">
                    Kegiatan #{idx + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}