"use client";

// Section Layanan Lain: bisa dipesan terpisah tanpa membeli paket.
// Tombol "Pesan via WA" membuka formulir singkat sesuai isian yang diatur admin.
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { syaratLayanan, teksHargaLayanan, type Layanan, type Pengaturan } from "@/data/sumitra";
import { CorakKompas } from "./Corak";
import FormPesan from "./FormPesan";
import IkonLayanan from "./IkonLayanan";
import { IkonWa } from "./SumitraHeader";

export default function SumitraLayanan({ layanan, pengaturan }: { layanan: Layanan[]; pengaturan: Pengaturan }) {
  const [pilih, setPilih] = useState<Layanan | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (pilih && !d.open) d.showModal();
    if (!pilih && d.open) d.close();
  }, [pilih]);

  if (layanan.length === 0) return null;
  const syarat = syaratLayanan(pengaturan);

  return (
    <section id="layanan" className="relative overflow-hidden bg-amber-50 text-slate-900 px-4 sm:px-6 py-20 sm:py-24">
      <CorakKompas />
      <div className="relative max-w-[1200px] mx-auto">
        <p className="text-[13px] font-extrabold tracking-[0.08em] text-teal-700">LAYANAN LAIN</p>
        <h2 className="mt-2.5 mb-3 text-3xl sm:text-[40px] leading-tight font-extrabold">Bisa dipesan terpisah</h2>
        <p className="mb-8 text-[17px] leading-relaxed text-slate-600 max-w-[760px]">
          Tidak perlu membeli paket wisata. Pesan pemandu, mobil, antar-jemput bandara, atau tiket saja sesuai kebutuhanmu.
          Paket internasional sudah all in, termasuk pesawat, hotel, transportasi, dan pemandu.
        </p>
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {layanan.map((l) => (
            <article key={l.id ?? l.nama} className="bg-white/90 border border-slate-200 rounded-[20px] p-6 flex flex-col gap-2.5">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-teal-100 text-teal-800 flex items-center justify-center">
                <IkonLayanan ikon={l.ikon} className="w-[26px] h-[26px]" />
              </div>
              <h3 className="mt-1 text-[19px] font-extrabold">{l.nama}</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">{l.deskripsi}</p>
              <p className="font-extrabold text-teal-800 text-[17px]">{teksHargaLayanan(l)}</p>
              <button
                type="button"
                onClick={() => setPilih(l)}
                className="mt-auto self-start inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm px-4 py-3 rounded-xl transition"
              >
                <IkonWa className="w-4 h-4" /> Pesan via WA
              </button>
            </article>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setPilih(null)}
        aria-labelledby="judul-pesan-layanan"
        className="m-auto w-[min(520px,calc(100%-2rem))] max-h-[calc(100dvh-2rem)] rounded-[20px] p-0 backdrop:bg-slate-950/60"
      >
        {pilih && (
          <div className="p-5 sm:p-6 text-slate-900">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-extrabold tracking-[0.08em] text-teal-700">PESAN LAYANAN</p>
                <h2 id="judul-pesan-layanan" className="text-2xl font-extrabold">{pilih.nama}</h2>
                <p className="text-sm font-bold text-teal-800 mt-0.5">{teksHargaLayanan(pilih)}</p>
              </div>
              <button type="button" onClick={() => setPilih(null)} aria-label="Tutup"
                className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 mb-4 text-sm text-amber-950">
              <p className="font-extrabold mb-1">Syarat pemesanan</p>
              <ul className="list-disc pl-5 space-y-0.5">
                {syarat.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <FormPesan
              key={pilih.id ?? pilih.nama}
              jenis="layanan"
              itemId={pilih.id}
              itemNama={pilih.nama}
              fields={pilih.fieldWa}
              nomorWa={pengaturan.nomorWa}
              teksSetuju={<>Saya sudah membaca <strong>syarat pemesanan</strong> di atas.</>}
            />
          </div>
        )}
      </dialog>
    </section>
  );
}
