"use client";

import { use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DATA_PRESTASI } from "../page";
import { Calendar, ArrowLeft, Image as ImageIcon, Video, Trophy } from "lucide-react";

export default function DetailPrestasiPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const prestasi = DATA_PRESTASI.find((item) => item.id === resolvedParams.id);

  if (!prestasi) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-800">Prestasi Tidak Ditemukan</h1>
          <Link href="/prestasi" className="text-amber-600 font-bold text-sm hover:underline">
            ← Kembali ke Daftar Prestasi
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      {/* Melebarkan kontainer utama dari max-w-5xl menjadi max-w-7xl agar sejajar dengan Header */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* TOMBOL KEMBALI */}
        <div>
          <Link
            href="/prestasi"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Prestasi</span>
          </Link>
        </div>

        {/* CONTAINER KONTEN UTAMA */}
        <article className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-8 p-6 sm:p-10 lg:p-12">
          
          {/* JUDUL & KATEGORI */}
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-amber-500 text-slate-950 text-xs font-black uppercase px-3.5 py-1 rounded-full shadow-xs">
                Tingkat {prestasi.kategori}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{prestasi.tanggal}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              {prestasi.judul}
            </h1>
          </div>

          {/* BANNER UTAMA (Memenuhi Lebar Card) */}
          <div className="relative w-full h-56 sm:h-80 lg:h-96 max-h-[400px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
            <img
              src={prestasi.banner || prestasi.thumbnail}
              alt={prestasi.judul}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* DESKRIPSI LENGKAP */}
          <div className="prose prose-slate max-w-none text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line border-b border-slate-100 pb-10">
            {prestasi.deskripsiLengkap}
          </div>

          {/* GALERI MEDIA FOTO */}
          {prestasi.galeriFoto && prestasi.galeriFoto.length > 0 && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xl">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                <h2>Galeri Dokumentasi Foto</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prestasi.galeriFoto.map((foto, index) => (
                  <div key={index} className="h-60 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                    <img
                      src={foto}
                      alt={`Dokumentasi ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALERI MEDIA VIDEO */}
          {prestasi.videoUrl && (
            <div className="space-y-5 pt-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xl">
                <Video className="w-5 h-5 text-amber-600" />
                <h2>Dokumentasi Video</h2>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <iframe
                  src={prestasi.videoUrl}
                  title="Dokumentasi Video Prestasi"
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

        </article>

      </main>

      <Footer />
    </div>
  );
}