"use client";

// Galeri "Jejak Perjalanan". Dirancang untuk dipakai dari HP:
// siswa mengambil/memilih foto, menulis keterangan, lalu menekan Unggah.
import { useCallback, useEffect, useState } from "react";
import { Camera, Eye, EyeOff, Trash2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { segarkanHalaman } from "@/lib/segarkanHalaman";
import { hapusFotoSumitra, unggahFotoSumitra } from "@/lib/fotoSumitra";
import type { GaleriRow } from "@/lib/sumitra";
import { inputCls, labelCls, kartu, tombolUtama, Pesan, type Msg, type HasilKueri } from "./bersama";

const TABEL = "sumitra_galeri";
const ambil = () => supabase.from(TABEL).select("*").order("created_at", { ascending: false }).limit(60);
const ambilPaket = () => supabase.from("sumitra_paket").select("id, nama").order("sort_order");

export default function GaleriPanel({ isAdmin, userId }: { isAdmin: boolean; userId: string }) {
  const [items, setItems] = useState<GaleriRow[]>([]);
  const [paket, setPaket] = useState<{ id: string; nama: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [keterangan, setKeterangan] = useState("");
  const [paketId, setPaketId] = useState("");
  const [proses, setProses] = useState("");
  const [msg, setMsg] = useState<Msg>(null);

  const terapkan = useCallback(({ data, error }: HasilKueri) => {
    if (error) setMsg({ type: "err", text: "Gagal memuat galeri: " + error.message });
    else setItems((data ?? []) as GaleriRow[]);
  }, []);
  // Setelah menyimpan: muat ulang daftar & segarkan halaman publik agar perubahan langsung tampil
  const load = useCallback(() => {
    segarkanHalaman("sumitra");
    return ambil().then(terapkan);
  }, [terapkan]);
  useEffect(() => {
    ambil().then(terapkan);
    ambilPaket().then(({ data }) => setPaket((data ?? []) as { id: string; nama: string }[]));
  }, [terapkan]);

  async function unggah(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (files.length === 0) return setMsg({ type: "err", text: "Pilih minimal satu foto." });
    let berhasil = 0;
    for (let i = 0; i < files.length; i++) {
      setProses(`Mengunggah foto ${i + 1} dari ${files.length}...`);
      try {
        const url = await unggahFotoSumitra(files[i], "galeri");
        const { error } = await supabase.from(TABEL).insert({
          foto_url: url,
          keterangan: keterangan.trim().slice(0, 120),
          paket_id: paketId || null,
        });
        if (error) throw new Error(error.message);
        berhasil++;
      } catch (err) {
        setMsg({ type: "err", text: `Foto ${i + 1} gagal: ${err instanceof Error ? err.message : "kesalahan tidak dikenal"}` });
      }
    }
    setProses("");
    if (berhasil > 0) {
      setMsg({ type: "ok", text: `${berhasil} foto berhasil diunggah ke website.` });
      setFiles([]);
      setKeterangan("");
      load();
    }
  }

  async function toggle(g: GaleriRow) {
    const { error } = await supabase.from(TABEL).update({ is_published: !g.is_published }).eq("id", g.id);
    if (error) setMsg({ type: "err", text: "Gagal mengubah status: " + error.message });
    else load();
  }
  async function hapus(g: GaleriRow) {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    const { error } = await supabase.from(TABEL).delete().eq("id", g.id);
    if (error) return setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    await hapusFotoSumitra(g.foto_url);
    load();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={unggah} className={kartu + " space-y-4"}>
        <div>
          <h2 className="font-extrabold text-white">Unggah Dokumentasi Perjalanan</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tampil di section Jejak Perjalanan. Foto dikompres otomatis agar hemat kuota.</p>
        </div>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 rounded-2xl px-4 py-7 text-center cursor-pointer hover:border-amber-400">
          <Camera className="w-8 h-8 text-amber-400" aria-hidden />
          <span className="text-sm font-bold text-slate-200">
            {files.length ? `${files.length} foto dipilih` : "Ambil foto atau pilih dari galeri HP"}
          </span>
          <span className="text-xs text-slate-500">Bisa memilih beberapa foto sekaligus</span>
          <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        </label>
        <label className={labelCls}>Keterangan
          <input className={inputCls} value={keterangan} onChange={(e) => setKeterangan(e.target.value)} maxLength={120} placeholder="Open trip Bromo, 12 peserta" />
        </label>
        <label className={labelCls}>Paket terkait (opsional)
          <select className={inputCls} value={paketId} onChange={(e) => setPaketId(e.target.value)}>
            <option value="">Tidak ada</option>
            {paket.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
          </select>
        </label>
        <Pesan msg={msg} />
        <button type="submit" disabled={!!proses} className={tombolUtama + " w-full sm:w-auto"}>
          <Upload className="w-4 h-4" /> {proses || "Unggah ke Website"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xs font-extrabold tracking-wider text-slate-400">TERBARU ({items.length})</h2>
        {items.length === 0 && <p className="text-sm text-slate-400">Belum ada foto.</p>}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((g) => {
            const bolehHapus = isAdmin || g.created_by === userId;
            return (
              <li key={g.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="relative aspect-square bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.foto_url} alt={g.keterangan} className={`w-full h-full object-cover ${g.is_published ? "" : "opacity-40"}`} />
                  {!g.is_published && (
                    <span className="absolute top-2 left-2 text-[10px] font-black bg-slate-950/80 text-slate-300 px-2 py-0.5 rounded">DISEMBUNYIKAN</span>
                  )}
                </div>
                <div className="p-2.5 space-y-2">
                  <p className="text-xs text-slate-300 line-clamp-2 min-h-8">{g.keterangan || "Tanpa keterangan"}</p>
                  <div className="flex gap-1.5">
                    {isAdmin && (
                      <button type="button" onClick={() => toggle(g)} aria-label={g.is_published ? "Sembunyikan" : "Tayangkan"}
                        className="flex-1 p-2 border border-slate-700 rounded-lg hover:bg-slate-800 flex justify-center">
                        {g.is_published ? <EyeOff className="w-4 h-4 text-slate-300" /> : <Eye className="w-4 h-4 text-slate-300" />}
                      </button>
                    )}
                    {bolehHapus && (
                      <button type="button" onClick={() => hapus(g)} aria-label="Hapus foto"
                        className="flex-1 p-2 border border-red-500/30 rounded-lg hover:bg-red-500/10 flex justify-center">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
