"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  History,
  Music,
  Target,
  Download,
  CheckCircle2,
} from "lucide-react";

export default function ProfilPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const profilData = [
    {
      id: "profil-singkat",
      title: "Profil Singkat",
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-slate-100 text-sm sm:text-base leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
          <p className="font-semibold text-amber-400 text-lg">
            Profil Singkat SMK Negeri 2 Malang
          </p>
          <p>
            SMK Negeri 2 Malang merupakan salah satu sekolah menengah kejuruan unggulan di Kota Malang yang berkomitmen mencetak lulusan siap kerja, berkarakter, dan berdaya saing di dunia industri. Sekolah ini berlokasi di Jalan Veteran No. 17, Ketawanggede, Kecamatan Lowokwaru, Kota Malang, pada kawasan yang strategis di pusat pendidikan Kota Malang.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 my-3">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-amber-400 font-bold block text-xs uppercase tracking-wider mb-1">Berpengalaman</span>
              <p className="text-xs sm:text-sm text-slate-200">
                Berdiri sejak tahun 1952, berkembang dari SHD, SMPS, hingga resmi menjadi SMK Negeri 2 Malang pada tahun 1995.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-amber-400 font-bold block text-xs uppercase tracking-wider mb-1">Komitmen Vokasi</span>
              <p className="text-xs sm:text-sm text-slate-200">
                Menghadirkan pendidikan kejuruan berstandar industri dengan keseimbangan kompetensi teknis, karakter, dan integritas.
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">6 Konsentrasi Keahlian Unggulan:</span>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-200">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Pekerjaan Sosial</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Perhotelan</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Kuliner</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Usaha Layanan Wisata</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Layanan Penunjang Keperawatan & Caregiving</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Teknik Komputer dan Jaringan</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "sejarah",
      title: "Sejarah",
      icon: <History className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-slate-100 text-sm sm:text-base leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
          <p className="font-semibold text-amber-400 text-lg">
            Sejarah SMK Negeri 2 Malang
          </p>
          <p>
            SMK Negeri 2 Malang merupakan salah satu sekolah vokasi senior di Kota Malang yang memiliki perjalanan panjang sejak pertengahan abad ke-20 di Jalan Veteran No. 17, Kota Malang.
          </p>

          <div className="space-y-4 pl-3 border-l-2 border-amber-500/50 my-4">
            <div className="relative pl-4">
              <span className="font-bold text-amber-400 text-sm block">1952 — Awal Berdiri (SHD)</span>
              <p className="text-xs sm:text-sm text-slate-200">Berdiri pertama kali dan dikenal sebagai SHD (Sekolah Hakim dan Dzaksa).</p>
            </div>
            <div className="relative pl-4">
              <span className="font-bold text-amber-400 text-sm block">Transformasi — SMPS</span>
              <p className="text-xs sm:text-sm text-slate-200">Berubah menjadi SMPS (Sekolah Menengah Pekerja Sosial) menyesuaikan kebutuhan masyarakat.</p>
            </div>
            <div className="relative pl-4">
              <span className="font-bold text-amber-400 text-sm block">1995 — SMK Negeri 2 Malang</span>
              <p className="text-xs sm:text-sm text-slate-200">Resmi bertransformasi menjadi SMK Negeri 2 Malang hingga saat ini.</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300">
            Perjalanan ini mencerminkan komitmen berkelanjutan dalam membangun pendidikan vokasi yang adaptif, profesional, dan berorientasi pada masa depan peserta didik.
          </p>
        </div>
      ),
    },
    {
      id: "visi-misi",
      title: "Visi & Misi",
      icon: <Target className="w-5 h-5" />,
      content: (
        <div className="space-y-5 text-slate-100 text-sm sm:text-base leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">Visi</span>
            <p className="text-lg font-semibold text-white italic">
              "Menjadi sekolah vokasi unggul yang menghasilkan lulusan kompeten, berkarakter, mandiri, dan siap kerja serta mampu bersaing di era global."
            </p>
          </div>

          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-3">Misi Utama:</span>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="bg-amber-500 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <span>Menyelenggarakan pendidikan kejuruan berstandar industri dan relevan dengan kebutuhan DU/DI/WK.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-amber-500 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <span>Mengembangkan pembelajaran aktif, inovatif, kreatif, dan berbasis kompetensi.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-amber-500 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <span>Menanamkan karakter, integritas, disiplin, tanggung jawab, dan etos kerja yang kuat.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-amber-500 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                <span>Meningkatkan kerja sama dengan mitra strategis untuk PKL dan peluang kerja.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-amber-500 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">5</span>
                <span>Mendorong lingkungan sekolah yang aman, nyaman, sehat, dan mendukung potensi peserta didik.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "hymne-mars",
      title: "Hymne & Mars",
      icon: <Music className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-slate-100 text-sm sm:text-base leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
          <p className="font-semibold text-amber-400 text-lg">
            Hymne dan Mars SMK Negeri 2 Malang
          </p>
          <p className="text-xs sm:text-sm text-slate-200">
            Merupakan simbol identitas sekolah yang mencerminkan semangat, kebanggaan, disiplin, kerja keras, dan cita-cita bersama.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-3">
            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
              <h4 className="font-bold text-amber-400 text-xs sm:text-sm mb-2 uppercase tracking-wide flex items-center gap-2">
                <Music className="w-4 h-4" /> Makna Hymne
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                Menggambarkan rasa syukur, hormat, dan kecintaan terhadap sekolah. Mengajak warga sekolah menumbuhkan rasa memiliki dan menjaga nama baik institusi.
              </p>
            </div>
            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
              <h4 className="font-bold text-amber-400 text-xs sm:text-sm mb-2 uppercase tracking-wide flex items-center gap-2">
                <Music className="w-4 h-4" /> Makna Mars
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                Mencerminkan semangat juang, kebersamaan, dan optimisme. Pengingat bersama untuk membangun prestasi dan mewujudkan sekolah unggul.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "akreditasi",
      title: "Akreditasi",
      icon: <Award className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-slate-100 text-sm sm:text-base leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
          <div className="flex items-center justify-between bg-amber-500/20 border border-amber-500/30 p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-slate-950 text-3xl shadow-lg">
                A
              </div>
              <div>
                <h4 className="font-extrabold text-white text-lg sm:text-xl">Terakreditasi "A"</h4>
                <p className="text-xs sm:text-sm text-amber-300 font-medium">BAN-S/M — Unggul</p>
              </div>
            </div>
            
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Unduh SK</span>
            </a>
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Peringkat:</span>
              <span className="font-bold text-amber-400">A (Sangat Baik)</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Nomor SK:</span>
              <span className="font-mono text-slate-200">1857/BAN-SM/SK/2022</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400">Tahun Penetapan:</span>
              <span className="text-slate-200">2022</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Masa Berlaku:</span>
              <span className="text-slate-200">2022 – 2027</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300">
            Akreditasi ini merupakan cerminan komitmen sekolah dalam memberikan layanan pendidikan vokasi bermutu, fasilitas laboratorium/workshop lengkap, dan budaya mutu berkelanjutan.
          </p>
        </div>
      ),
    },
  ];

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? profilData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === profilData.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header Utama */}
      <Header />

      {/* Konten Carousel Profil */}
      <main className="relative flex-1 w-full flex flex-col justify-center items-center py-16 px-4 sm:px-8 overflow-hidden">
        
        {/* Background Foto & Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/kepalasekolah.png"
            alt="Background SMKN 2 Malang"
            className="w-full h-full object-cover object-center filter blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />
        </div>

        {/* Kontainer Utama (Diperlebar ke max-w-6xl) */}
        <div className="relative z-10 max-w-6xl w-full flex flex-col items-center">
          
          {/* Judul Submenu Dinamis */}
          <div className="text-center mb-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
              PROFIL SEKOLAH
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 transition-all duration-300">
              {profilData[activeIndex].title}
            </h1>
          </div>

          {/* 5 Dots Indicator Navigasi */}
          <div className="flex items-center gap-3 my-4">
            {profilData.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveIndex(index)}
                title={item.title}
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  activeIndex === index
                    ? "w-4 h-4 bg-amber-400 ring-4 ring-amber-400/30 scale-110"
                    : "w-3 h-3 bg-white/30 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Glassmorphism Card (Lebar maksimal) */}
          <div className="mt-4 w-full relative group">
            
            <button
              onClick={prevSlide}
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/10 backdrop-blur-md transition shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl min-h-[380px] flex flex-col justify-start transition-all duration-500">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 pb-3 border-b border-white/10">
                {profilData[activeIndex].icon}
                <span>{profilData[activeIndex].title} — SMKN 2 Malang</span>
              </div>

              {profilData[activeIndex].content}
            </div>

            <button
              onClick={nextSlide}
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/10 backdrop-blur-md transition shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

        </div>

      </main>

      {/* Footer Utama */}
      <Footer />
    </div>
  );
}