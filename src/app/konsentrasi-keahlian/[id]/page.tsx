import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KonsentrasiTabs from "@/components/KonsentrasiTabs";
import { DATA_KONSENTRASI } from "@/data/konsentrasi-keahlian";
import { ArrowLeft, Sparkles } from "lucide-react";

export function generateStaticParams() {
  return DATA_KONSENTRASI.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const jurusan = DATA_KONSENTRASI.find((item) => item.id === id);

  if (!jurusan) {
    return { title: "Jurusan tidak ditemukan", robots: { index: false } };
  }

  const description = jurusan.deskripsi.slice(0, 160);

  return {
    title: jurusan.nama,
    description,
    alternates: { canonical: `/konsentrasi-keahlian/${id}` },
    openGraph: {
      title: jurusan.nama,
      description,
      locale: "id_ID",
      images: [{ url: jurusan.gambar }],
    },
    twitter: {
      card: "summary_large_image",
      title: jurusan.nama,
      description,
      images: [jurusan.gambar],
    },
  };
}

export default async function DetailKonsentrasiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dataJurusan = DATA_KONSENTRASI.find((item) => item.id === id);

  if (!dataJurusan) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-10 max-w-[1400px] mx-auto space-y-8">
        <Link
          href="/konsentrasi-keahlian"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Konsentrasi Keahlian
        </Link>

        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 p-6 sm:p-10">
          <div className="absolute inset-0 z-0">
            <img
              src={dataJurusan.gambar}
              alt={dataJurusan.nama}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl uppercase tracking-wider">
                {dataJurusan.singkatan}
              </span>
              <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> SMKN 2 Malang
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {dataJurusan.nama}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {dataJurusan.deskripsi}
            </p>
          </div>
        </div>

        <KonsentrasiTabs
          gambar={dataJurusan.gambar}
          materiPembelajaran={dataJurusan.materiPembelajaran}
          peluangKarier={dataJurusan.peluangKarier}
          fasilitasLab={dataJurusan.fasilitasLab}
        />
      </main>

      <Footer />
    </div>
  );
}