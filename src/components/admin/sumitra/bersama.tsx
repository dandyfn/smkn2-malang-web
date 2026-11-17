"use client";

// Komponen kecil yang dipakai bersama panel admin Sumitra
import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { unggahFotoSumitra, type FolderFoto } from "@/lib/fotoSumitra";

export { inputCls, Pesan, StatusBadge, AksiBaris, TayangDanUrutan, type Msg } from "../kadoea/ui";

export const labelCls = "block text-xs font-bold text-slate-300 space-y-1.5";
export const tombolUtama =
  "inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl transition min-h-11";
export const kartu = "bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5";

/** Pola ambil data dari Supabase tanpa memanggil setState langsung di dalam efek. */
export type HasilKueri = { data: unknown; error: { message: string } | null };

/** Tombol filter berbentuk pil */
export function PilFilter<T extends string>({
  pilihan, aktif, onPilih,
}: { pilihan: { id: T; label: string }[]; aktif: T; onPilih: (id: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {pilihan.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onPilih(p.id)}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition min-h-9 ${
            aktif === p.id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

/** Pilih foto dari HP/komputer -> dikompres -> diunggah -> URL dikembalikan lewat onChange */
export function FieldFoto({
  label, value, onChange, folder, rasio = "aspect-video",
}: { label: string; value: string | null; onChange: (url: string | null) => void; folder: FolderFoto; rasio?: string }) {
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState("");

  async function pilih(file: File | undefined) {
    if (!file) return;
    setGalat("");
    setProses(true);
    try {
      onChange(await unggahFotoSumitra(file, folder));
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Gagal mengunggah foto.");
    } finally {
      setProses(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-slate-300">{label}</p>
      {value ? (
        <div className={`relative w-full max-w-sm ${rasio} rounded-xl overflow-hidden bg-slate-800`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange(null)} aria-label="Hapus foto"
            className="absolute top-2 right-2 p-2 rounded-lg bg-slate-950/80 text-red-300 hover:text-red-200">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className={`flex items-center justify-center gap-2 w-full max-w-sm border-2 border-dashed border-slate-700 rounded-xl p-5 text-sm font-semibold text-slate-300 cursor-pointer hover:border-amber-400 ${proses ? "opacity-60 pointer-events-none" : ""}`}>
          <ImagePlus className="w-5 h-5 text-amber-400" />
          {proses ? "Mengunggah..." : "Pilih foto"}
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => pilih(e.target.files?.[0])} />
        </label>
      )}
      {galat && <p className="text-xs font-semibold text-rose-400">{galat}</p>}
    </div>
  );
}

export function formatWaktu(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
