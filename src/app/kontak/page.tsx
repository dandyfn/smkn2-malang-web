"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  ExternalLink,
  Sparkles,
} from "lucide-react";

// ====== DATA KONTAK (ganti dengan data asli sekolah) ======
const NO_WHATSAPP = "6281234567890"; // format internasional: tanpa +, spasi, atau 0 di depan
const NO_TELEPON_TAMPIL = "(0341) 551342";
const NO_TELEPON_LINK = "+62341551342";
const EMAIL_TUJUAN = "info@smkn2malang.sch.id";
const PESAN_WA_DEFAULT = "Halo, saya ingin bertanya tentang SMKN 2 Malang.";
const SUBJEK_EMAIL = "Pertanyaan dari Website";

export default function KontakPage() {
  const [pesanWA, setPesanWA] = useState(PESAN_WA_DEFAULT);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tautan langsung
  const waLink = `https://wa.me/${NO_WHATSAPP}?text=${encodeURIComponent(
    pesanWA.trim() || PESAN_WA_DEFAULT
  )}`;
  const emailLink = `mailto:${EMAIL_TUJUAN}?subject=${encodeURIComponent(SUBJEK_EMAIL)}`;
  const gmailLink = `https://mail.google.com/mail/?view=cm&to=${EMAIL_TUJUAN}&su=${encodeURIComponent(
    SUBJEK_EMAIL
  )}`;
  const telLink = `tel:${NO_TELEPON_LINK}`;

  // EFEK CANVAS NEURAL NETWORK (KUNING INTERAKTIF BACKGROUND TERANG)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2 + 1.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;

          p.x += forceDirectionX * force * 3;
          p.y += forceDirectionY * force * 3;
        }

        // Titik node kuning pekat agar kontras di latar putih
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(217, 119, 6, 0.75)"; // Amber-600
        ctx.fill();

        // Garis penghubung antar titik
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distanceP2P = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (distanceP2P < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - distanceP2P / 120) * 0.3;
            ctx.strokeStyle = `rgba(234, 179, 8, ${alpha})`; // Amber-500
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Garis penghubung ke kursor mouse
        if (distance < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          const mouseAlpha = (1 - distance / mouse.radius) * 0.5;
          ctx.strokeStyle = `rgba(217, 119, 6, ${mouseAlpha})`; // Amber-600
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative overflow-hidden">
      {/* CANVAS BACKGROUND NEURAL NETWORK */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-80"
      />

      {/* HEADER */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 w-full px-4 sm:px-6 lg:px-12 py-12 max-w-[1400px] mx-auto space-y-12">
        {/* HERO SECTION */}
        <div className="text-center space-y-3 max-w-3xl mx-auto pt-4">
          <span className="text-xs font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 border border-amber-500/20 px-4 py-1.5 rounded-full inline-flex items-center gap-2 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> HUBUNGI KAMI
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            Layanan Informasi <span className="text-amber-500">SMKN 2 Malang</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Punya pertanyaan seputar pendaftaran, jurusan, atau kerja sama? Silakan hubungi kami melalui saluran informasi di bawah ini.
          </p>
        </div>

        {/* MAIN CONTACT CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* INFORMASI KONTAK & JAM OPERASIONAL (LEFT COLUMN) */}
          <div className="lg:col-span-5 space-y-6">
            {/* CARD DETAIL KONTAK */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                Kontak Resmi
              </h2>

              <div className="space-y-5">
                {/* Alamat */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Alamat Sekolah
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 leading-snug mt-1">
                      Jl. Veteran No. 17, Lowokwaru, Kota Malang, Jawa Timur 65145
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl shrink-0 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Email Resmi
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 leading-snug mt-1 break-all">
                      {EMAIL_TUJUAN}
                    </p>
                  </div>
                </div>

                {/* Telepon */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl shrink-0 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Telepon / Fax
                    </h3>
                    <p className="text-sm font-semibold text-slate-800 leading-snug mt-1">
                      {NO_TELEPON_TAMPIL}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD JAM OPERASIONAL */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Jam Operasional
                  </h2>
                  <p className="text-xs text-slate-500">Layanan Tata Usaha & Informasi</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 font-medium">
                  <span className="text-slate-600">Senin - Kamis</span>
                  <span className="font-bold text-slate-900">07.00 - 15.30 WIB</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 font-medium">
                  <span className="text-slate-600">Jumat</span>
                  <span className="font-bold text-slate-900">07.00 - 14.30 WIB</span>
                </div>
                <div className="flex justify-between py-2 font-medium text-rose-500">
                  <span>Sabtu, Minggu & Hari Libur</span>
                  <span className="font-bold">Tutup</span>
                </div>
              </div>
            </div>
          </div>

          {/* HUBUNGI LANGSUNG (RIGHT COLUMN) */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Hubungi Kami Langsung
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pilih salah satu saluran, Anda akan langsung diarahkan ke aplikasinya.
              </p>
            </div>

            {/* 1. WHATSAPP */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600 text-white rounded-xl">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">Chat via WhatsApp</p>
                    <p className="text-xs text-slate-500">Respon cepat di jam operasional</p>
                  </div>
                </div>
                <span className="hidden sm:inline text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md">
                  Fast Response
                </span>
              </div>

              <textarea
                rows={2}
                value={pesanWA}
                onChange={(e) => setPesanWA(e.target.value)}
                placeholder="Tulis pesan awal (opsional)..."
                maxLength={500}
                className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition resize-none"
              />

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                <span>Buka Chat WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* 2. EMAIL */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900">Kirim Email</p>
                  <p className="text-xs text-slate-500 break-all">{EMAIL_TUJUAN}</p>
                </div>
              </div>

              <a
                href={emailLink}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-600/20"
              >
                <span>Buka Aplikasi Email</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-xs text-slate-500">
                Email tidak terbuka?{" "}
                <a
                  href={gmailLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold underline"
                >
                  Tulis lewat Gmail
                </a>
              </p>
            </div>

            {/* 3. TELEPON */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-600 text-white rounded-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">Telepon Sekolah</p>
                  <p className="text-xs text-slate-500">{NO_TELEPON_TAMPIL}</p>
                </div>
              </div>

              <a
                href={telLink}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-purple-600/20"
              >
                <span>Hubungi Sekarang</span>
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}