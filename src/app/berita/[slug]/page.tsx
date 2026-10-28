import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// cache() supaya metadata dan halaman memakai 1 kali fetch yang sama
const getBerita = cache(async (slug: string): Promise<BeritaDetail | null> => {
  const bySlug = await supabase
    .from("berita")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (bySlug.data) return bySlug.data as BeritaDetail;

  const byId = await supabase
    .from("berita")
    .select("*")
    .eq("id", slug)
    .eq("status", "published")
    .maybeSingle();
  return (byId.data as BeritaDetail) ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const berita = await getBerita(slug);

  if (!berita) {
    return { title: "Berita tidak ditemukan", robots: { index: false } };
  }

  const description =
    berita.deskripsi_singkat?.trim() || stripHtml(berita.konten).slice(0, 160);
  const image = getDirectImageUrl(berita.banner_url || berita.gambar_url);

  return {
    title: berita.judul,
    description,
    alternates: { canonical: `/berita/${berita.slug || slug}` },
    openGraph: {
      type: "article",
      title: berita.judul,
      description,
      publishedTime: berita.created_at,
      locale: "id_ID",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: berita.judul,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const berita = await getBerita(slug);

  if (!berita) notFound();

  const imageUrl = getDirectImageUrl(berita.banner_url || berita.gambar_url);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          <article className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold text-xs rounded-lg uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                {berita.kategori || "BERITA"}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
                <time dateTime={berita.created_at}>
                  {new Date(berita.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "Asia/Jakarta",
                  })}
                </time>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {berita.judul}
            </h1>

            {imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-800/80 w-full bg-slate-950">
                <img
                  src={imageUrl}
                  alt={berita.judul}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[370px] object-cover"
                />
              </div>
            )}

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

            <div
              className="berita-content pt-4 border-t border-slate-800/80"
              dangerouslySetInnerHTML={{ __html: berita.konten }}
            />
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}