import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Calendar, ArrowLeft, Image as ImageIcon, Video } from "lucide-react";
import type { Prestasi } from "../page";

function stripHtml(html: string): string {
  return (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const getPrestasi = cache(async (id: string): Promise<Prestasi | null> => {
  const { data } = await supabase
    .from("prestasi")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Prestasi) ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prestasi = await getPrestasi(id);

  if (!prestasi) {
    return { title: "Prestasi tidak ditemukan", robots: { index: false } };
  }

  const description = stripHtml(prestasi.deskripsi_lengkap).slice(0, 160);
  const image = prestasi.banner_url;

  return {
    title: prestasi.judul,
    description,
    alternates: { canonical: `/prestasi/${id}` },
    openGraph: {
      type: "article",
      title: prestasi.judul,
      description,
      locale: "id_ID",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: prestasi.judul,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function DetailPrestasiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prestasi = await getPrestasi(id);

  if (!prestasi) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div>
          <Link
            href="/prestasi"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-600 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Prestasi</span>
          </Link>
        </div>

        <article className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-8 p-6 sm:p-10 lg:p-12">
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-amber-500 text-slate-950 text-xs font-black uppercase px-3.5 py-1 rounded-full shadow-xs">
                Tingkat {prestasi.kategori || prestasi.tingkat}
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

          {prestasi.banner_url && (
            <div className="relative w-full h-56 sm:h-80 lg:h-96 max-h-[400px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
              <img
                src={prestasi.banner_url}
                alt={prestasi.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className="prestasi-content text-base sm:text-lg border-b border-slate-100 pb-10"
            dangerouslySetInnerHTML={{ __html: prestasi.deskripsi_lengkap }}
          />

          {prestasi.galeri_foto && prestasi.galeri_foto.length > 0 && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xl">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                <h2>Galeri Dokumentasi Foto</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prestasi.galeri_foto.map((foto, index) => (
                  <div
                    key={index}
                    className="h-60 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs"
                  >
                    <img
                      src={foto}
                      alt={`${prestasi.judul} - dokumentasi ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {prestasi.video_url && (
            <div className="space-y-5 pt-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xl">
                <Video className="w-5 h-5 text-amber-600" />
                <h2>Dokumentasi Video</h2>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <iframe
                  src={
                    prestasi.video_url.includes("watch?v=")
                      ? prestasi.video_url.replace("watch?v=", "embed/")
                      : prestasi.video_url
                  }
                  title={`Video ${prestasi.judul}`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}