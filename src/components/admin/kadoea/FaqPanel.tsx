"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquareReply, Plus, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { FaqRow } from "@/lib/kadoea";
import { inputCls, Pesan, StatusBadge, AksiBaris, TayangDanUrutan, type Msg } from "./ui";

const TABEL = "kadoea_faq";

// Ambil semua baris (termasuk yang belum dijawab / disembunyikan) untuk panel admin
const ambil = () => supabase.from(TABEL).select("*").order("sort_order").order("created_at", { ascending: false });

type Filter = "menunggu" | "dijawab" | "semua";
type Form = { pertanyaan: string; jawaban: string; is_published: boolean; sort_order: number };
const kosong: Form = { pertanyaan: "", jawaban: "", is_published: true, sort_order: 0 };

export default function FaqPanel() {
  const [items, setItems] = useState<FaqRow[]>([]);
  const [filter, setFilter] = useState<Filter>("menunggu");
  const [form, setForm] = useState<Form>(kosong);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [penanya, setPenanya] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  // Hasil kueri diterapkan ke state di dalam .then (bukan langsung di efek)
  const terapkan = useCallback(({ data, error }: { data: unknown; error: { message: string } | null }) => {
    if (error) setMsg({ type: "err", text: "Gagal memuat FAQ: " + error.message });
    else setItems((data ?? []) as FaqRow[]);
  }, []);
  const load = useCallback(() => ambil().then(terapkan), [terapkan]);

  useEffect(() => {
    ambil().then(terapkan);
  }, [terapkan]);

  const menunggu = items.filter((f) => !f.jawaban);
  const tampil = filter === "menunggu" ? menunggu : filter === "dijawab" ? items.filter((f) => f.jawaban) : items;

  function startEdit(f: FaqRow) {
    setEditingId(f.id);
    setPenanya(f.nama_penanya);
    // Pertanyaan pengunjung yang belum dijawab: otomatis dicentang tayang setelah dijawab
    setForm({ pertanyaan: f.pertanyaan, jawaban: f.jawaban ?? "", is_published: f.jawaban ? f.is_published : true, sort_order: f.sort_order });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() { setEditingId(null); setPenanya(null); setForm(kosong); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const payload = {
      pertanyaan: form.pertanyaan.trim().slice(0, 500),
      jawaban: form.jawaban.trim().slice(0, 1500),
      is_published: form.is_published,
      sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
    };
    if (!payload.pertanyaan || !payload.jawaban) {
      return setMsg({ type: "err", text: "Pertanyaan dan jawaban wajib diisi." });
    }
    setSaving(true);
    const { error } = editingId
      ? await supabase.from(TABEL).update(payload).eq("id", editingId)
      : await supabase.from(TABEL).insert(payload);
    setSaving(false);
    if (error) return setMsg({ type: "err", text: "Gagal menyimpan: " + error.message });
    setMsg({ type: "ok", text: editingId ? "Jawaban disimpan." : "FAQ ditambahkan." });
    reset();
    load();
  }

  async function toggle(f: FaqRow) {
    if (!f.jawaban) return setMsg({ type: "err", text: "Jawab pertanyaan ini dulu sebelum ditayangkan." });
    const { error } = await supabase.from(TABEL).update({ is_published: !f.is_published }).eq("id", f.id);
    if (error) setMsg({ type: "err", text: "Gagal mengubah status: " + error.message });
    else load();
  }
  async function hapus(f: FaqRow) {
    if (!confirm(`Hapus pertanyaan "${f.pertanyaan}"?`)) return;
    const { error } = await supabase.from(TABEL).delete().eq("id", f.id);
    if (error) setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    else load();
  }

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "menunggu", label: `Menunggu jawaban (${menunggu.length})` },
    { id: "dijawab", label: "Sudah dijawab" },
    { id: "semua", label: "Semua" },
  ];

  return (
    <div className="space-y-8">
      <form onSubmit={save} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-white">
              {editingId ? (form.jawaban || !penanya ? "Edit FAQ" : "Jawab Pertanyaan") : "Tambah FAQ"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {penanya !== null && editingId
                ? `Dikirim oleh: ${penanya || "Pengunjung tanpa nama"}. Pertanyaan boleh dirapikan sebelum ditayangkan.`
                : "Tampil di bagian “Pertanyaan Umum” halaman KADOEA."}
            </p>
          </div>
          {editingId && (
            <button type="button" onClick={reset} className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Batal
            </button>
          )}
        </div>

        <input className={inputCls} placeholder="Pertanyaan" maxLength={500}
          value={form.pertanyaan} onChange={(e) => setForm({ ...form, pertanyaan: e.target.value })} />
        <textarea className={inputCls + " resize-y"} rows={4} maxLength={1500} placeholder="Jawaban"
          value={form.jawaban} onChange={(e) => setForm({ ...form, jawaban: e.target.value })} />
        <TayangDanUrutan tayang={form.is_published} urutan={form.sort_order}
          onTayang={(v) => setForm({ ...form, is_published: v })} onUrutan={(v) => setForm({ ...form, sort_order: v })} />

        <Pesan msg={msg} />
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-xl transition">
          {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saving ? "Menyimpan..." : editingId ? "Simpan Jawaban" : "Tambah FAQ"}
        </button>
      </form>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-extrabold text-white">Daftar FAQ ({items.length})</h2>
          <div className="flex gap-1.5">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === f.id ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {tampil.length === 0 && (
          <p className="text-sm text-slate-400">{filter === "menunggu" ? "Tidak ada pertanyaan baru dari pengunjung." : "Belum ada FAQ."}</p>
        )}
        {tampil.map((f) => (
          <div key={f.id} className={`bg-slate-900 border rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-start justify-between ${
            f.jawaban ? "border-slate-800" : "border-amber-500/40"
          }`}>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-white">{f.pertanyaan}</span>
                {f.jawaban ? (
                  <StatusBadge tayang={f.is_published} />
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400">Menunggu jawaban</span>
                )}
              </div>
              {f.nama_penanya !== null && (
                <p className="text-[11px] text-slate-500">
                  Dari pengunjung: {f.nama_penanya || "tanpa nama"} · {new Date(f.created_at).toLocaleDateString("id-ID")}
                </p>
              )}
              {f.jawaban && <p className="text-xs text-slate-300 whitespace-pre-line break-words">{f.jawaban}</p>}
            </div>
            {f.jawaban ? (
              <AksiBaris tayang={f.is_published} onToggle={() => toggle(f)} onEdit={() => startEdit(f)} onHapus={() => hapus(f)} />
            ) : (
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(f)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg">
                  <MessageSquareReply className="w-4 h-4" /> Jawab
                </button>
                <AksiHapus onHapus={() => hapus(f)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AksiHapus({ onHapus }: { onHapus: () => void }) {
  return (
    <button onClick={onHapus} className="px-3 py-1.5 text-xs font-semibold border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10">
      Hapus
    </button>
  );
}
