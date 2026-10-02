"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Calendar, ExternalLink, Tag } from "lucide-react";
import Link from "next/link";

// Import Header & Footer sesuai lokasi file proyek
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BeritaDetail {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  deskripsi_singkat: string;
  banner_url: string;
  gambar_url?: string;
  kategori: string;
  link_penting: string;
  status: "draft" | "published";
  created_at: string;
}

function getDirectImageUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.includes("postimg.cc") && !url.includes("i.postimg.cc")) {
    return url.replace("postimg.cc", "i.postimg.cc");
  }
  return url;
}

export default function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [berita, setBerita] = useState<BeritaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailBerita = async () => {
      let { data } = await supabase
        .from("berita")
        .select("*")
        .eq("slug", resolvedParams.slug)
        .eq("status", "published")
        .single();

      if (!data) {
        const fallback = await supabase
          .from("berita")
          .select("*")
          .eq("id", resolvedParams.slug)
          .eq("status", "published")
          .single();
        data = fallback.data;
      }

      if (data) setBerita(data);
      setLoading(false);
    };

    fetchDetailBerita();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
        <Header />
        <div className="flex justify-center items-center py-32">
          <p className="text-slate-400 animate-pulse text-sm">Memuat artikel berita...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
        <Header />
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <h1 className="text-xl font-bold">Artikel Tidak Ditemukan</h1>
          <p className="text-slate-400 text-sm">Berita tidak ditemukan atau belum dipublikasikan.</p>
          <Link 
            href="/" 
            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const rawUrl = berita.banner_url || berita.gambar_url;
  const imageUrl = getDirectImageUrl(rawUrl);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Header Komponen */}
      <Header />

      {/* Style Global untuk Konten HTML Tiptap */}
      <style jsx global>{`
        .berita-content img {
          display: block;
          margin-left: auto;
          margin-right: auto;
          border-radius: 0.75rem;
          max-width: 100%;
          height: auto;
        }
        .berita-content h1 { font-size: 1.75rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #f8fafc; }
        .berita-content h2 { font-size: 1.35rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #f1f5f9; }
        .berita-content h3 { font-size: 1.15rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #e2e8f0; }
        .berita-content p { margin-bottom: 1rem; line-height: 1.75; color: #cbd5e1; font-size: 0.95rem; }
        .berita-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #cbd5e1; }
        .berita-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: #cbd5e1; }
        .berita-content blockquote { border-left: 4px solid #f59e0b; padding-left: 1rem; font-style: italic; color: #94a3b8; margin: 1rem 0; }
        .berita-content u { text-decoration: underline; }
      `}</style>

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          
          {/* Tombol Kembali */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          {/* Card Utama Berita */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 backdrop-blur-sm">
            
            {/* Tag Kategori & Tanggal */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold text-xs rounded-lg uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                {berita.kategori || "BERITA"}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
                <span>
                  {new Date(berita.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Judul Utama */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {berita.judul}
            </h1>

            {/* Gambar Banner Utama */}
            {imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-800/80 w-full bg-slate-950">
                <img
                  src={imageUrl}
                  alt={berita.judul}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-full h-auto max-h-[370px] object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Link Penting (Akan muncul jika berita.link_penting terisi) */}
            {berita.link_penting && (
              <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-between gap-4">
                <span className="text-xs sm:text-sm font-semibold text-amber-300">
                  Tautan / Lampiran Terkait:
                </span>
                <a
                  href={berita.link_penting}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  <span>Buka Tautan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Isi Konten Berita (Render HTML Tiptap) */}
            <div
              className="berita-content pt-4 border-t border-slate-800/80"
              dangerouslySetInnerHTML={{ __html: berita.konten }}
            />
          </div>
        </div>
      </main>

      {/* Footer Komponen */}
      <Footer />
    </div>
  );
}