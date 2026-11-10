"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Plus, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { PaketRow } from "@/lib/kadoea";
import { inputCls, Pesan, StatusBadge, AksiBaris, TayangDanUrutan, type Msg } from "./ui";

const TABEL = "kadoea_paket";

// Ambil semua baris (termasuk yang disembunyikan) untuk ditampilkan di panel admin
const ambil = () => supabase.from(TABEL).select("*").order("sort_order").order("created_at");

type Form = {
  nama: string; ringkas: string; harga: string; satuan: string;
  fiturTeks: string; // satu fitur per baris
  unggulan: boolean; is_published: boolean; sort_order: number;
};
const kosong: Form = {
  nama: "", ringkas: "", harga: "Hubungi kami", satuan: "per bulan",
  fiturTeks: "", unggulan: false, is_published: true, sort_order: 0,
};

export default function PaketPanel() {
  const [items, setItems] = useState<PaketRow[]>([]);
  const [form, setForm] = useState<Form>(kosong);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  // Hasil kueri diterapkan ke state di dalam .then (bukan langsung di efek)
  const terapkan = useCallback(({ data, error }: { data: unknown; error: { message: string } | null }) => {
    if (error) setMsg({ type: "err", text: "Gagal memuat paket: " + error.message });
    else setItems((data ?? []) as PaketRow[]);
  }, []);
  const load = useCallback(() => ambil().then(terapkan), [terapkan]);

  useEffect(() => {
    ambil().then(terapkan);
  }, [terapkan]);

  function startEdit(p: PaketRow) {
    setEditingId(p.id);
    setForm({
      nama: p.nama, ringkas: p.ringkas, harga: p.harga, satuan: p.satuan,
      fiturTeks: (p.fitur ?? []).join("\n"), unggulan: p.unggulan,
      is_published: p.is_published, sort_order: p.sort_order,
    });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() { setEditingId(null); setForm(kosong); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const payload = {
      nama: form.nama.trim().slice(0, 80),
      ringkas: form.ringkas.trim().slice(0, 300),
      harga: form.harga.trim().slice(0, 40) || "Hubungi kami",
      satuan: form.satuan.trim().slice(0, 30),
      // pecah textarea per baris, buang baris kosong, maksimal 10 fitur
      fitur: form.fiturTeks.split("\n").map((f) => f.trim()).filter(Boolean).slice(0, 10),
      unggulan: form.unggulan,
      is_published: form.is_published,
      sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
    };
    if (!payload.nama) return setMsg({ type: "err", text: "Nama paket wajib diisi." });

    setSaving(true);
    const { error } = editingId
      ? await supabase.from(TABEL).update(payload).eq("id", editingId)
      : await supabase.from(TABEL).insert(payload);
    setSaving(false);
    if (error) return setMsg({ type: "err", text: "Gagal menyimpan: " + error.message });
    setMsg({ type: "ok", text: editingId ? "Paket diperbarui." : "Paket ditambahkan." });
    reset();
    load();
  }

  async function toggle(p: PaketRow) {
    const { error } = await supabase.from(TABEL).update({ is_published: !p.is_published }).eq("id", p.id);
    if (error) setMsg({ type: "err", text: "Gagal mengubah status: " + error.message });
    else load();
  }
  async function hapus(p: PaketRow) {
    if (!confirm(`Hapus paket "${p.nama}"?`)) return;
    const { error } = await supabase.from(TABEL).delete().eq("id", p.id);
    if (error) setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    else load();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={save} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-white">{editingId ? "Edit Paket" : "Tambah Paket"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Paket tampil sebagai kartu di bagian &quot;Paket Layanan&quot;.</p>
          </div>
          {editingId && (
            <button type="button" onClick={reset} className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Batal edit
            </button>
          )}
        </div>

        <input className={inputCls} placeholder="Nama paket, misalnya Tinggal Bulanan" maxLength={80}
          value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
        <textarea className={inputCls + " resize-y"} rows={2} maxLength={300} placeholder="Deskripsi singkat paket"
          value={form.ringkas} onChange={(e) => setForm({ ...form, ringkas: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={inputCls} placeholder='Harga, misalnya "Rp 3.500.000" atau "Hubungi kami"' maxLength={40}
            value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} />
          <input className={inputCls} placeholder='Satuan, misalnya "per bulan"' maxLength={30}
            value={form.satuan} onChange={(e) => setForm({ ...form, satuan: e.target.value })} />
        </div>
        <textarea className={inputCls + " resize-y"} rows={5} placeholder={"Isi layanan, satu baris satu poin.\nContoh:\nMakan 3 kali sehari\nPendampingan caregiver"}
          value={form.fiturTeks} onChange={(e) => setForm({ ...form, fiturTeks: e.target.value })} />

        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={form.unggulan} onChange={(e) => setForm({ ...form, unggulan: e.target.checked })} />
          Tandai sebagai &quot;Paling Diminati&quot; (kartu diberi bingkai kuning)
        </label>
        <TayangDanUrutan tayang={form.is_published} urutan={form.sort_order}
          onTayang={(v) => setForm({ ...form, is_published: v })} onUrutan={(v) => setForm({ ...form, sort_order: v })} />

        <Pesan msg={msg} />
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-xl transition">
          {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Paket"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-extrabold text-white">Daftar Paket ({items.length})</h2>
        {items.length === 0 && <p className="text-sm text-slate-400">Belum ada paket.</p>}
        {items.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-start justify-between">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-white">{p.nama}</span>
                <span className="text-xs text-amber-400 font-bold">{p.harga} {p.satuan}</span>
                {p.unggulan && <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">Paling Diminati</span>}
                <StatusBadge tayang={p.is_published} />
              </div>
              <p className="text-xs text-slate-400">{p.ringkas}</p>
              <ul className="text-xs text-slate-300 space-y-0.5">
                {(p.fitur ?? []).map((f) => (
                  <li key={f} className="flex items-start gap-1.5"><Check className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
            </div>
            <AksiBaris tayang={p.is_published} onToggle={() => toggle(p)} onEdit={() => startEdit(p)} onHapus={() => hapus(p)} />
          </div>
        ))}
      </div>
    </div>
  );
}
