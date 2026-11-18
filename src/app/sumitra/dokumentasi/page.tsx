import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SumitraHeader from "@/components/sumitra/SumitraHeader";
import GaleriLengkap from "@/components/sumitra/GaleriLengkap";
import { JudulKecil, SumitraFooter } from "@/components/sumitra/SumitraSections";
import { getGaleriSumitra, getPengaturanSumitra } from "@/lib/sumitra";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Dokumentasi Perjalanan | Sumitra Kelana Wisata" },
  description: "Kumpulan dokumentasi perjalanan wisata bersama Sumitra Kelana Wisata, travel agent SMK Negeri 2 Malang.",
  alternates: { canonical: "/sumitra/dokumentasi" },
};

export default async function DokumentasiPage() {
  const [pengaturan, galeri] = await Promise.all([getPengaturanSumitra(), getGaleriSumitra()]);

  return (
    <main className="min-h-screen">
      <SumitraHeader nomorWa={pengaturan.nomorWa} logoUrl={pengaturan.logoUrl} />
      <section
        className="px-4 sm:px-6 pt-8 pb-20 bg-slate-50 text-slate-900"
        style={{ backgroundImage: "url('/images/sumitra/pola-dokumentasi.png')", backgroundSize: "600px 600px" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <Link href="/sumitra#dokumentasi" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700 mb-5">
            <ArrowLeft className="w-4 h-4" aria-hidden /> Kembali ke halaman Sumitra
          </Link>
          <JudulKecil>Jejak Perjalanan</JudulKecil>
          <h1 className="mt-2.5 mb-8 text-3xl sm:text-[40px] leading-tight font-extrabold">Semua dokumentasi tur</h1>
          <GaleriLengkap awal={galeri.foto} total={galeri.total} />
        </div>
      </section>
      <SumitraFooter pengaturan={pengaturan} />
    </main>
  );
}
