"use client";

// Testimoni peserta: setujui, sembunyikan, hapus, dan balas (balasan tampil di website).
import { useCallback, useEffect, useState } from "react";
import { Check, MessageSquareReply, Save, Star, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { segarkanHalaman } from "@/lib/segarkanHalaman";
import { hapusFotoSumitra } from "@/lib/fotoSumitra";
import type { TestimoniRow } from "@/lib/sumitra";
import { inputCls, kartu, Pesan, StatusBadge, PilFilter, formatWaktu, type Msg, type HasilKueri } from "./bersama";

const TABEL = "sumitra_testimoni";
const ambil = () => supabase.from(TABEL).select("*").order("created_at", { ascending: false });

type Filter = "menunggu" | "belum-dibalas" | "semua";

export default function TestimoniPanel() {
  const [items, setItems] = useState<TestimoniRow[]>([]);
  const [filter, setFilter] = useState<Filter>("menunggu");
  const [balasId, setBalasId] = useState<string | null>(null);
  const [balasTeks, setBalasTeks] = useState("");
  const [msg, setMsg] = useState<Msg>(null);

  const terapkan = useCallback(({ data, error }: HasilKueri) => {
    if (error) setMsg({ type: "err", text: "Gagal memuat testimoni: " + error.message });
    else setItems((data ?? []) as TestimoniRow[]);
  }, []);
  // Setelah menyimpan: muat ulang daftar & segarkan halaman publik agar perubahan langsung tampil
  const load = useCallback(() => {
    segarkanHalaman("sumitra");
    return ambil().then(terapkan);
  }, [terapkan]);
  useEffect(() => {
    ambil().then(terapkan);
  }, [terapkan]);

  // "Menunggu" = belum pernah disetujui (belum tayang dan belum dibalas)
  const perluSetuju = (t: TestimoniRow) => !t.is_published && !t.balasan;
  const menunggu = items.filter(perluSetuju);
  const belumDibalas = items.filter((t) => t.is_published && !t.balasan);
  const tampil = filter === "menunggu" ? menunggu : filter === "belum-dibalas" ? belumDibalas : items;

  async function ubah(t: TestimoniRow, data: Partial<TestimoniRow>, ok: string) {
    const { error } = await supabase.from(TABEL).update(data).eq("id", t.id);
    if (error) return setMsg({ type: "err", text: "Gagal menyimpan: " + error.message });
    setMsg({ type: "ok", text: ok });
    load();
  }
  async function hapus(t: TestimoniRow) {
    if (!confirm(`Hapus testimoni dari "${t.nama}"?`)) return;
    const { error } = await supabase.from(TABEL).delete().eq("id", t.id);
    if (error) return setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    await hapusFotoSumitra(t.foto_url);
    load();
  }
  async function simpanBalasan(t: TestimoniRow, setujuiJuga: boolean) {
    const teks = balasTeks.trim().slice(0, 1500);
    if (!teks) return setMsg({ type: "err", text: "Tulis balasan terlebih dahulu." });
    await ubah(t, { balasan: teks, dibalas_at: new Date().toISOString(), ...(setujuiJuga ? { is_published: true } : {}) },
      setujuiJuga ? "Testimoni disetujui dan balasan disimpan." : "Balasan disimpan.");
    setBalasId(null);
    setBalasTeks("");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-extrabold text-white">Testimoni ({items.length})</h2>
        <PilFilter
          pilihan={[
            { id: "menunggu", label: `Menunggu persetujuan (${menunggu.length})` },
            { id: "belum-dibalas", label: `Belum dibalas (${belumDibalas.length})` },
            { id: "semua", label: "Semua" },
          ]}
          aktif={filter}
          onPilih={setFilter}
        />
      </div>
      <Pesan msg={msg} />
      {tampil.length === 0 && (
        <p className="text-sm text-slate-400">
          {filter === "menunggu" ? "Tidak ada testimoni baru." : filter === "belum-dibalas" ? "Semua testimoni tayang sudah dibalas." : "Belum ada testimoni."}
        </p>
      )}

      {tampil.map((t) => (
        <article key={t.id} className={`${kartu} space-y-3 ${perluSetuju(t) ? "!border-amber-500/40" : ""}`}>
          <div className="flex flex-col sm:flex-row gap-3">
            {t.foto_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.foto_url} alt="" className="w-full sm:w-40 aspect-video object-cover rounded-xl bg-slate-800 shrink-0" />
            )}
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-white">{t.nama}</span>
                <span className="flex gap-0.5" aria-label={`${t.rating} bintang`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                  ))}
                </span>
                {perluSetuju(t) ? (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400">Menunggu persetujuan</span>
                ) : (
                  <StatusBadge tayang={t.is_published} />
                )}
              </div>
              <p className="text-[11px] text-slate-500">{t.perjalanan ? `${t.perjalanan} · ` : ""}{formatWaktu(t.created_at)}</p>
              <p className="text-sm text-slate-300 whitespace-pre-line break-words">{t.isi}</p>
            </div>
          </div>

          {t.balasan && balasId !== t.id && (
            <div className="border-l-2 border-amber-400 bg-slate-950/60 rounded-r-xl px-4 py-3">
              <div className="flex justify-between gap-3">
                <p className="text-[11px] font-black uppercase text-amber-400">Balasan Sumitra</p>
                <button type="button" aria-label="Hapus balasan" className="text-slate-500 hover:text-red-400"
                  onClick={() => confirm("Hapus balasan ini?") && ubah(t, { balasan: null, dibalas_at: null }, "Balasan dihapus.")}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-line mt-1">{t.balasan}</p>
            </div>
          )}

          {balasId === t.id ? (
            <div className="space-y-2">
              <textarea className={inputCls + " resize-y"} rows={3} maxLength={1500} autoFocus value={balasTeks}
                onChange={(e) => setBalasTeks(e.target.value)} placeholder={`Tulis balasan untuk ${t.nama}...`} />
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => simpanBalasan(t, false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg">
                  <Save className="w-4 h-4" /> Simpan Balasan
                </button>
                {perluSetuju(t) && (
                  <button type="button" onClick={() => simpanBalasan(t, true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg">
                    <Check className="w-4 h-4" /> Setujui &amp; Balas
                  </button>
                )}
                <button type="button" onClick={() => setBalasId(null)} className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white">Batal</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => { setBalasId(t.id); setBalasTeks(t.balasan ?? ""); }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-sky-500/40 text-sky-300 rounded-lg hover:bg-sky-500/10">
                <MessageSquareReply className="w-4 h-4" /> {t.balasan ? "Edit balasan" : "Balas"}
              </button>
              {perluSetuju(t) ? (
                <>
                  <button type="button" onClick={() => ubah(t, { is_published: true }, "Testimoni disetujui dan tampil di website.")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg">
                    <Check className="w-4 h-4" /> Setujui
                  </button>
                  <button type="button" onClick={() => hapus(t)}
                    className="px-3 py-2 text-xs font-semibold border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10">
                    Tolak &amp; hapus
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => ubah(t, { is_published: !t.is_published }, t.is_published ? "Testimoni disembunyikan." : "Testimoni ditayangkan.")}
                    className="px-3 py-2 text-xs font-semibold border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800">
                    {t.is_published ? "Sembunyikan" : "Tayangkan"}
                  </button>
                  <button type="button" onClick={() => hapus(t)} aria-label="Hapus testimoni"
                    className="p-2 border border-red-500/30 rounded-lg hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
