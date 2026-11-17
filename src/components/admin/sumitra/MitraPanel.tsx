"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { hapusFotoSumitra } from "@/lib/fotoSumitra";
import type { MitraRow } from "@/lib/sumitra";
import {
  inputCls, labelCls, kartu, tombolUtama, Pesan, StatusBadge, AksiBaris, TayangDanUrutan, FieldFoto, type Msg, type HasilKueri,
} from "./bersama";

const TABEL = "sumitra_mitra";
const ambil = () => supabase.from(TABEL).select("*").order("sort_order").order("created_at");

type Form = { nama: string; logo_url: string | null; is_published: boolean; sort_order: number };
const kosong: Form = { nama: "", logo_url: null, is_published: true, sort_order: 0 };

export default function MitraPanel() {
  const [items, setItems] = useState<MitraRow[]>([]);
  const [form, setForm] = useState<Form>(kosong);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  const terapkan = useCallback(({ data, error }: HasilKueri) => {
    if (error) setMsg({ type: "err", text: "Gagal memuat mitra: " + error.message });
    else setItems((data ?? []) as MitraRow[]);
  }, []);
  const load = useCallback(() => ambil().then(terapkan), [terapkan]);
  useEffect(() => {
    ambil().then(terapkan);
  }, [terapkan]);

  function startEdit(m: MitraRow) {
    setEditingId(m.id);
    setForm({ nama: m.nama, logo_url: m.logo_url, is_published: m.is_published, sort_order: m.sort_order });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() { setEditingId(null); setForm(kosong); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const payload = { ...form, nama: form.nama.trim().slice(0, 80), sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0 };
    if (payload.nama.length < 2) return setMsg({ type: "err", text: "Nama mitra wajib diisi." });
    setSaving(true);
    const { error } = editingId
      ? await supabase.from(TABEL).update(payload).eq("id", editingId)
      : await supabase.from(TABEL).insert(payload);
    setSaving(false);
    if (error) return setMsg({ type: "err", text: "Gagal menyimpan: " + error.message });
    setMsg({ type: "ok", text: editingId ? "Mitra diperbarui." : "Mitra ditambahkan." });
    reset();
    load();
  }
  async function toggle(m: MitraRow) {
    const { error } = await supabase.from(TABEL).update({ is_published: !m.is_published }).eq("id", m.id);
    if (error) setMsg({ type: "err", text: "Gagal mengubah status: " + error.message });
    else load();
  }
  async function hapus(m: MitraRow) {
    if (!confirm(`Hapus mitra "${m.nama}"?`)) return;
    const { error } = await supabase.from(TABEL).delete().eq("id", m.id);
    if (error) return setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    await hapusFotoSumitra(m.logo_url);
    load();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={save} className={kartu + " space-y-4"}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-white">{editingId ? "Edit Mitra" : "Tambah Mitra"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tampil di section Mitra Kami. Logo boleh dikosongkan.</p>
          </div>
          {editingId && (
            <button type="button" onClick={reset} className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Batal
            </button>
          )}
        </div>
        <label className={labelCls}>Nama mitra
          <input className={inputCls} value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} maxLength={80} />
        </label>
        <FieldFoto label="Logo (opsional)" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} folder="mitra" rasio="aspect-[3/1]" />
        <TayangDanUrutan label="Tayangkan di halaman Sumitra" tayang={form.is_published} urutan={form.sort_order}
          onTayang={(v) => setForm({ ...form, is_published: v })} onUrutan={(v) => setForm({ ...form, sort_order: v })} />
        <Pesan msg={msg} />
        <button type="submit" disabled={saving} className={tombolUtama}>
          {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saving ? "Menyimpan..." : editingId ? "Simpan Mitra" : "Tambah Mitra"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-extrabold text-white">Daftar Mitra ({items.length})</h2>
        {items.length === 0 && <p className="text-sm text-slate-400">Belum ada mitra.</p>}
        {items.map((m) => (
          <div key={m.id} className={kartu + " flex flex-col sm:flex-row gap-3 sm:items-center justify-between"}>
            <div className="flex items-center gap-3 min-w-0">
              {m.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.logo_url} alt="" className="h-9 w-auto max-w-[90px] object-contain bg-white rounded p-1" />
              )}
              <span className="font-bold text-sm text-white">{m.nama}</span>
              <StatusBadge tayang={m.is_published} />
            </div>
            <AksiBaris tayang={m.is_published} onToggle={() => toggle(m)} onEdit={() => startEdit(m)} onHapus={() => hapus(m)} />
          </div>
        ))}
      </div>
    </div>
  );
}
