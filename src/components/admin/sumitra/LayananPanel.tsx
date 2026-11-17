"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { LayananRow } from "@/lib/sumitra";
import { PILIHAN_FIELD, PILIHAN_IKON, teksHargaLayanan, type FieldWa, type IkonLayanan as Ikon } from "@/data/sumitra";
import IkonLayanan from "@/components/sumitra/IkonLayanan";
import {
  inputCls, labelCls, kartu, tombolUtama, Pesan, StatusBadge, AksiBaris, TayangDanUrutan, type Msg, type HasilKueri,
} from "./bersama";

const TABEL = "sumitra_layanan";
const ambil = () => supabase.from(TABEL).select("*").order("sort_order").order("created_at");

type Form = {
  nama: string; ikon: Ikon; deskripsi: string; harga_mulai: string; satuan_harga: string; label_harga: string;
  field_wa: FieldWa[]; is_published: boolean; sort_order: number;
};
const kosong: Form = {
  nama: "", ikon: "pemandu", deskripsi: "", harga_mulai: "", satuan_harga: "", label_harga: "",
  field_wa: ["tanggal", "jumlah"], is_published: true, sort_order: 0,
};

export default function LayananPanel() {
  const [items, setItems] = useState<LayananRow[]>([]);
  const [form, setForm] = useState<Form>(kosong);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  const terapkan = useCallback(({ data, error }: HasilKueri) => {
    if (error) setMsg({ type: "err", text: "Gagal memuat layanan: " + error.message });
    else setItems((data ?? []) as LayananRow[]);
  }, []);
  const load = useCallback(() => ambil().then(terapkan), [terapkan]);
  useEffect(() => {
    ambil().then(terapkan);
  }, [terapkan]);

  function startEdit(l: LayananRow) {
    setEditingId(l.id);
    setForm({
      nama: l.nama, ikon: l.ikon, deskripsi: l.deskripsi, harga_mulai: l.harga_mulai == null ? "" : String(l.harga_mulai),
      satuan_harga: l.satuan_harga, label_harga: l.label_harga, field_wa: l.field_wa ?? [], is_published: l.is_published, sort_order: l.sort_order,
    });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() { setEditingId(null); setForm(kosong); }

  function toggleField(f: FieldWa) {
    setForm((s) => ({ ...s, field_wa: s.field_wa.includes(f) ? s.field_wa.filter((x) => x !== f) : [...s.field_wa, f] }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const harga = form.harga_mulai.replace(/[^0-9]/g, "");
    const payload = {
      nama: form.nama.trim().slice(0, 80),
      ikon: form.ikon,
      deskripsi: form.deskripsi.trim().slice(0, 400),
      harga_mulai: harga ? Number(harga) : null,
      satuan_harga: form.satuan_harga,
      label_harga: form.label_harga.trim().slice(0, 60),
      // urutan isian mengikuti urutan baku
      field_wa: PILIHAN_FIELD.map((p) => p.id).filter((id) => form.field_wa.includes(id)),
      is_published: form.is_published,
      sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
    };
    if (payload.nama.length < 2) return setMsg({ type: "err", text: "Nama layanan wajib diisi." });
    setSaving(true);
    const { error } = editingId
      ? await supabase.from(TABEL).update(payload).eq("id", editingId)
      : await supabase.from(TABEL).insert(payload);
    setSaving(false);
    if (error) return setMsg({ type: "err", text: "Gagal menyimpan: " + error.message });
    setMsg({ type: "ok", text: editingId ? "Layanan diperbarui." : "Layanan ditambahkan." });
    reset();
    load();
  }

  async function toggle(l: LayananRow) {
    const { error } = await supabase.from(TABEL).update({ is_published: !l.is_published }).eq("id", l.id);
    if (error) setMsg({ type: "err", text: "Gagal mengubah status: " + error.message });
    else load();
  }
  async function hapus(l: LayananRow) {
    if (!confirm(`Hapus layanan "${l.nama}"?`)) return;
    const { error } = await supabase.from(TABEL).delete().eq("id", l.id);
    if (error) setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    else load();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={save} className={kartu + " space-y-4"}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-white">{editingId ? "Edit Layanan" : "Tambah Layanan"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Layanan yang bisa dipesan terpisah tanpa membeli paket wisata.</p>
          </div>
          {editingId && (
            <button type="button" onClick={reset} className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Batal
            </button>
          )}
        </div>

        <label className={labelCls}>Nama layanan
          <input className={inputCls} value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} maxLength={80} placeholder="Rent Car" />
        </label>
        <fieldset>
          <legend className="text-xs font-bold text-slate-300 mb-1.5">Ikon</legend>
          <div className="grid grid-cols-6 gap-2 max-w-md">
            {PILIHAN_IKON.map((i) => {
              const dipilih = form.ikon === i.id;
              return (
                <button key={i.id} type="button" onClick={() => setForm({ ...form, ikon: i.id })} aria-label={`Ikon ${i.label}`} aria-pressed={dipilih}
                  title={i.label}
                  className={`h-12 rounded-xl flex items-center justify-center transition ${
                    dipilih ? "border-2 border-teal-300 bg-teal-900 text-teal-200" : "border border-slate-700 bg-slate-950 text-slate-400 hover:text-white"
                  }`}>
                  <IkonLayanan ikon={i.id} className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className={labelCls}>Deskripsi singkat
          <textarea className={inputCls + " resize-y"} rows={3} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} maxLength={400} />
        </label>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className={labelCls}>Harga mulai (Rp)
            <input className={inputCls} inputMode="numeric" value={form.harga_mulai} onChange={(e) => setForm({ ...form, harga_mulai: e.target.value })} placeholder="500000" />
          </label>
          <label className={labelCls}>Satuan
            <select className={inputCls} value={form.satuan_harga} onChange={(e) => setForm({ ...form, satuan_harga: e.target.value })}>
              <option value="">(tanpa satuan, tampil &quot;Mulai Rp...&quot;)</option>
              <option value="hari">per hari</option>
              <option value="perjalanan">per perjalanan</option>
              <option value="orang">per orang</option>
            </select>
          </label>
          <label className={labelCls}>Teks pengganti harga
            <input className={inputCls} value={form.label_harga} onChange={(e) => setForm({ ...form, label_harga: e.target.value })} maxLength={60} placeholder="Tanpa biaya layanan" />
          </label>
        </div>
        <fieldset>
          <legend className="text-xs font-bold text-slate-300 mb-1.5">Data yang ditanyakan di formulir pemesanan (nama & nomor WA selalu ditanyakan)</legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-slate-200">
            {PILIHAN_FIELD.map((f) => (
              <label key={f.id} className="flex items-center gap-2 min-h-10">
                <input type="checkbox" checked={form.field_wa.includes(f.id)} onChange={() => toggleField(f.id)} className="w-4 h-4" />
                {f.label}
              </label>
            ))}
          </div>
        </fieldset>
        <TayangDanUrutan label="Tayangkan di halaman Sumitra" tayang={form.is_published} urutan={form.sort_order}
          onTayang={(v) => setForm({ ...form, is_published: v })} onUrutan={(v) => setForm({ ...form, sort_order: v })} />
        <Pesan msg={msg} />
        <button type="submit" disabled={saving} className={tombolUtama}>
          {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saving ? "Menyimpan..." : editingId ? "Simpan Layanan" : "Tambah Layanan"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-extrabold text-white">Daftar Layanan ({items.length})</h2>
        {items.length === 0 && <p className="text-sm text-slate-400">Belum ada layanan.</p>}
        {items.map((l) => (
          <div key={l.id} className={kartu + " flex flex-col sm:flex-row gap-3 sm:items-center justify-between"}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-teal-900/60 text-teal-200 flex items-center justify-center shrink-0">
                <IkonLayanan ikon={l.ikon} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-white">{l.nama}</span>
                  <StatusBadge tayang={l.is_published} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {teksHargaLayanan({ hargaMulai: l.harga_mulai, satuanHarga: l.satuan_harga, labelHarga: l.label_harga })}
                </p>
              </div>
            </div>
            <AksiBaris tayang={l.is_published} onToggle={() => toggle(l)} onEdit={() => startEdit(l)} onHapus={() => hapus(l)} />
          </div>
        ))}
      </div>
    </div>
  );
}
