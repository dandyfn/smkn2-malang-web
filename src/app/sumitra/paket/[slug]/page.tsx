import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SumitraHeader from "@/components/sumitra/SumitraHeader";
import FormPesan from "@/components/sumitra/FormPesan";
import { FotoPaket } from "@/components/sumitra/SumitraPaket";
import { SumitraFooter } from "@/components/sumitra/SumitraSections";
import { getPaketSumitra } from "@/lib/sumitra";
import { FIELD_PAKET, LABEL_JENIS, syaratPaket, teksHarga } from "@/data/sumitra";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { paket } = await getPaketSumitra(slug);
  if (!paket) return { title: "Paket tidak ditemukan" };
  return {
    title: { absolute: `${paket.nama} | Sumitra Kelana Wisata` },
    description: paket.ringkasan || `${paket.nama} bersama Sumitra Kelana Wisata, travel agent SMK Negeri 2 Malang.`,
    alternates: { canonical: `/sumitra/paket/${paket.slug}` },
    openGraph: paket.fotoUrl ? { images: [paket.fotoUrl] } : undefined,
  };
}

export default async function DetailPaketPage({ params }: Props) {
  const { slug } = await params;
  const { paket, pengaturan } = await getPaketSumitra(slug);
  if (!paket) notFound();

  const harga = teksHarga(paket.hargaMulai, "");
  const syarat = syaratPaket(pengaturan);
  const info = [paket.jadwal, paket.durasi].filter(Boolean).join(" · ");

  return (
    <main className="bg-slate-50 min-h-screen">
      <SumitraHeader nomorWa={pengaturan.nomorWa} logoUrl={pengaturan.logoUrl} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
        <Link href="/sumitra#paket" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700 mb-4">
          <ArrowLeft className="w-4 h-4" aria-hidden /> Kembali ke semua paket
        </Link>
        <FotoPaket paket={paket} sizes="(min-width: 1200px) 1200px, 100vw" className="aspect-[16/9] sm:aspect-[21/7] rounded-3xl" />

        <div className="mt-8 flex flex-wrap gap-8 items-start">
          {/* Informasi paket */}
          <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-6">
            <div>
              <span className="bg-slate-950 text-amber-400 text-[11px] font-extrabold tracking-[0.06em] px-2.5 py-1 rounded-lg">
                {LABEL_JENIS[paket.jenis]}
              </span>
              <h1 className="mt-3.5 mb-2 text-3xl sm:text-[40px] font-extrabold leading-tight">{paket.nama}</h1>
              {info && <p className="text-base text-slate-600">{info}</p>}
              {paket.ringkasan && <p className="mt-3 text-[17px] leading-relaxed text-slate-700">{paket.ringkasan}</p>}
            </div>

            <section className="bg-white border border-slate-200 rounded-[20px] p-6">
              <h2 className="text-xl font-extrabold mb-3">Sudah termasuk</h2>
              {paket.termasuk.length > 0 ? (
                <ul className="list-disc pl-5 text-[15px] leading-loose text-slate-700">
                  {paket.termasuk.map((t) => <li key={t}>{t}</li>)}
                </ul>
              ) : (
                <p className="text-[15px] text-slate-600">Rincian fasilitas akan dijelaskan admin Sumitra lewat WhatsApp.</p>
              )}
              {paket.susunanAcara.length > 0 && (
                <>
                  <h2 className="text-xl font-extrabold mt-6 mb-3">Susunan acara</h2>
                  <ol className="list-decimal pl-5 text-[15px] leading-loose text-slate-700">
                    {paket.susunanAcara.map((t) => <li key={t}>{t}</li>)}
                  </ol>
                </>
              )}
            </section>

            <section aria-labelledby="judul-syarat" className="bg-amber-50 border border-amber-300 rounded-[20px] p-6">
              <h2 id="judul-syarat" className="text-xl font-extrabold text-amber-900 mb-3">Syarat pembayaran &amp; pembatalan</h2>
              <ol className="list-decimal pl-5 text-[15px] leading-relaxed text-amber-950 space-y-1.5">
                {syarat.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </section>
          </div>

          {/* Formulir pemesanan */}
          <aside aria-labelledby="judul-form" className="flex-[1_1_360px] min-w-0 bg-white border border-slate-200 rounded-[20px] p-6 lg:sticky lg:top-24">
            <p className="text-[13px] font-semibold text-slate-600">{harga ? "Mulai dari" : "Harga"}</p>
            <p className="text-3xl font-extrabold">
              {harga ?? "Hubungi kami"}
              {harga && paket.satuanHarga && <span className="text-[15px] font-semibold text-slate-500"> / {paket.satuanHarga}</span>}
            </p>
            {paket.catatanHarga && <p className="text-sm text-slate-500 mt-1">{paket.catatanHarga}</p>}
            <h2 id="judul-form" className="mt-4 pt-4 mb-3.5 border-t border-slate-100 text-lg font-extrabold">Formulir pemesanan</h2>
            <FormPesan
              jenis="paket"
              itemId={paket.id}
              itemNama={paket.nama}
              fields={FIELD_PAKET}
              nomorWa={pengaturan.nomorWa}
              teksSetuju={
                <>Saya sudah membaca <strong>syarat pembayaran &amp; pembatalan</strong>, termasuk bahwa DP tidak dapat dikembalikan jika batal.</>
              }
            />
          </aside>
        </div>
      </div>

      <SumitraFooter pengaturan={pengaturan} />
    </main>
  );
}
