"use client";

// Section Paket Wisata: tab Open Trip / Private Trip / Internasional + kartu paket seragam
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mountain } from "lucide-react";
import { JENIS_PAKET, LABEL_JENIS, teksHarga, type JenisPaket, type Paket } from "@/data/sumitra";
import { CorakRute } from "./Corak";

export function FotoPaket({ paket, sizes, className = "" }: { paket: Paket; sizes: string; className?: string }) {
  return (
    <div className={`relative bg-slate-200 overflow-hidden ${className}`}>
      {paket.fotoUrl ? (
        <Image src={paket.fotoUrl} alt={paket.nama} fill sizes={sizes} className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center gap-2 text-slate-300">
          <CorakRute terang />
          <Mountain className="relative w-9 h-9 text-amber-400" aria-hidden />
          <span className="relative text-sm font-bold">{paket.nama}</span>
        </div>
      )}
    </div>
  );
}

export default function SumitraPaket({ paket }: { paket: Paket[] }) {
  const tersedia = JENIS_PAKET.filter((j) => paket.some((p) => p.jenis === j.id));
  const [aktif, setAktif] = useState<JenisPaket | null>(tersedia[0]?.id ?? null);
  const tampil = paket.filter((p) => p.jenis === aktif);

  return (
    <section id="paket" className="relative overflow-hidden bg-slate-100 text-slate-900 px-4 sm:px-6 py-20 sm:py-24">
      <CorakRute />
      <div className="relative max-w-[1200px] mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
          <div>
            <p className="text-[13px] font-extrabold tracking-[0.08em] text-teal-700">PAKET WISATA</p>
            <h2 className="mt-2.5 text-3xl sm:text-[40px] leading-tight font-extrabold">Pilih perjalananmu</h2>
          </div>
          {tersedia.length > 0 && (
            <div role="tablist" aria-label="Jenis paket" className="flex flex-wrap gap-2 bg-white border border-slate-200 rounded-2xl p-1.5">
              {tersedia.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  role="tab"
                  aria-selected={aktif === j.id}
                  onClick={() => setAktif(j.id)}
                  className={`min-h-11 px-4 rounded-xl text-sm font-bold transition ${
                    aktif === j.id ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {j.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {tampil.length === 0 ? (
          <p className="text-slate-600">Paket wisata segera hadir. Hubungi kami untuk perjalanan sesuai keinginanmu.</p>
        ) : (
          <div role="tabpanel" className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {tampil.map((p) => {
              const harga = teksHarga(p.hargaMulai, "");
              const keterangan = [p.jadwal, p.durasi].filter(Boolean).join(" · ") || p.ringkasan;
              return (
                <article key={p.slug} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden flex flex-col">
                  <div className="relative">
                    <FotoPaket paket={p} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10]" />
                    <span className="absolute top-3.5 left-3.5 bg-slate-950 text-amber-400 text-[11px] font-extrabold tracking-[0.06em] px-2.5 py-1 rounded-lg">
                      {LABEL_JENIS[p.jenis]}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col gap-2.5 grow">
                    <h3 className="text-xl font-extrabold">{p.nama}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{keterangan}</p>
                    <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-600">{harga ? "Mulai dari" : "Harga"}</p>
                        <p className="text-xl font-extrabold">{harga ?? "Hubungi kami"}</p>
                      </div>
                      <Link
                        href={`/sumitra/paket/${p.slug}`}
                        className="shrink-0 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm px-4 py-3 rounded-xl transition"
                      >
                        Lihat &amp; Pesan
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <p className="mt-5 text-sm text-slate-600">
          Pembayaran DP di awal dan pelunasan sebelum hari keberangkatan. Aturan pembatalan tercantum di detail tiap paket.
        </p>
      </div>
    </section>
  );
}
