"use client";

// Semua dokumentasi perjalanan: dimuat 24 foto per tahap, ketuk foto untuk melihat ukuran penuh.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { GaleriItem } from "@/data/sumitra";

const PER_TAHAP = 24;

export default function GaleriLengkap({ awal, total }: { awal: GaleriItem[]; total: number }) {
  const [foto, setFoto] = useState<GaleriItem[]>(awal);
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState("");
  const [buka, setBuka] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (buka !== null && !d.open) d.showModal();
    if (buka === null && d.open) d.close();
  }, [buka]);

  async function muatLagi() {
    setMemuat(true);
    setGalat("");
    const { data, error } = await supabase
      .from("sumitra_galeri")
      .select("id, foto_url, keterangan")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(foto.length, foto.length + PER_TAHAP - 1);
    setMemuat(false);
    if (error) return setGalat("Gagal memuat foto. Coba lagi.");
    const baru = (data ?? []).map((r) => ({ id: r.id as string, fotoUrl: r.foto_url as string, keterangan: (r.keterangan as string) ?? "" }));
    setFoto((lama) => [...lama, ...baru.filter((b) => !lama.some((l) => l.id === b.id))]);
  }

  const aktif = buka !== null ? foto[buka] : null;
  const geser = (arah: number) => setBuka((i) => (i === null ? null : (i + arah + foto.length) % foto.length));

  if (foto.length === 0) {
    return <p className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600">Dokumentasi perjalanan segera hadir.</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {foto.map((g, i) => (
          <li key={g.id}>
            <button type="button" onClick={() => setBuka(i)} aria-label={`Lihat foto: ${g.keterangan || "dokumentasi perjalanan"}`}
              className="relative block w-full aspect-square rounded-2xl overflow-hidden bg-slate-200 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300">
              <Image src={g.fotoUrl} alt={g.keterangan || "Dokumentasi perjalanan Sumitra"} fill
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw" className="object-cover" />
              {g.keterangan && (
                <span className="absolute left-0 right-0 bottom-0 p-2.5 text-xs font-bold text-white bg-slate-950/55 line-clamp-2">{g.keterangan}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-slate-600">Menampilkan {foto.length} dari {total} foto</p>
        {foto.length < total && (
          <button type="button" onClick={muatLagi} disabled={memuat}
            className="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-xl transition">
            {memuat ? "Memuat..." : "Muat lebih banyak"}
          </button>
        )}
        {galat && <p className="text-sm font-semibold text-rose-600" role="alert">{galat}</p>}
      </div>

      <dialog ref={dialogRef} onClose={() => setBuka(null)} aria-label="Foto dokumentasi"
        className="m-auto w-[min(1000px,calc(100%-1.5rem))] max-h-[calc(100dvh-1.5rem)] bg-transparent p-0 backdrop:bg-slate-950/85">
        {aktif && (
          <div className="relative">
            <div className="relative w-full h-[70dvh] rounded-2xl overflow-hidden bg-slate-900">
              <Image src={aktif.fotoUrl} alt={aktif.keterangan || "Dokumentasi perjalanan Sumitra"} fill sizes="1000px" className="object-contain" />
            </div>
            {aktif.keterangan && <p className="mt-3 text-center text-white font-semibold">{aktif.keterangan}</p>}
            <button type="button" onClick={() => setBuka(null)} aria-label="Tutup"
              className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-950/70 text-white hover:bg-slate-950">
              <X className="w-5 h-5" />
            </button>
            {foto.length > 1 && (
              <>
                <button type="button" onClick={() => geser(-1)} aria-label="Foto sebelumnya"
                  className="absolute left-3 top-[35dvh] -translate-y-1/2 p-3 rounded-full bg-slate-950/70 text-white hover:bg-slate-950">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => geser(1)} aria-label="Foto berikutnya"
                  className="absolute right-3 top-[35dvh] -translate-y-1/2 p-3 rounded-full bg-slate-950/70 text-white hover:bg-slate-950">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
