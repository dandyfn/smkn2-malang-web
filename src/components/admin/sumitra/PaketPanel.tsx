"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { segarkanHalaman } from "@/lib/segarkanHalaman";
import { hapusFotoSumitra } from "@/lib/fotoSumitra";
import type { PaketRow } from "@/lib/sumitra";
import { JENIS_PAKET, LABEL_JENIS, teksHarga, type JenisPaket } from "@/data/sumitra";
import {
  inputCls, labelCls, kartu, tombolUtama, Pesan, StatusBadge, AksiBaris, TayangDanUrutan, FieldFoto, type Msg, type HasilKueri,
} from "./bersama";

const TABEL = "sumitra_paket";
const ambil = () => supabase.from(TABEL).select("*").order("sort_order").order("created_at");

type Form = {
  nama: string; slug: string; jenis: JenisPaket; ringkasan: string; jadwal: string; durasi: string;
  harga_mulai: string; satuan_harga: string; catatan_harga: string; termasuk: string; susunan_acara: string;
  foto_url: string | null; is_published: boolean; sort_order: number;
};
const kosong: Form = {
  nama: "", slug: "", jenis: "open_trip", ringkasan: "", jadwal: "", durasi: "", harga_mulai: "", satuan_harga: "orang",
  catatan_harga: "", termasuk: "", susunan_acara: "", foto_url: null, is_published: true, sort_order: 0,
};

export function buatSlug(teks: string) {
  return teks.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export default function PaketPanel() {
  const [items, setItems] = useState<PaketRow[]>([]);
  const [form, setForm] = useState<Form>(kosong);
  const [slugManual, setSlugManual] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  const terapkan = useCallback(({ data, error }: HasilKueri) => {
    if (error) setMsg({ type: "err", text: "Gagal memuat paket: " + error.message });
    else setItems((data ?? []) as PaketRow[]);
  }, []);
  // Setelah menyimpan: muat ulang daftar & segarkan halaman publik agar perubahan langsung tampil
  const load = useCallback(() => {
    segarkanHalaman("sumitra");
    return ambil().then(terapkan);
  }, [terapkan]);
  useEffect(() => {
    ambil().then(terapkan);
  }, [terapkan]);

  function ubah<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => {
      const baru = { ...f, [k]: v };
      if (k === "nama" && !slugManual) baru.slug = buatSlug(String(v));
      return baru;
    });
  }

  function startEdit(p: PaketRow) {
    setEditingId(p.id);
    setSlugManual(true);
    setForm({
      nama: p.nama, slug: p.slug, jenis: p.jenis, ringkasan: p.ringkasan, jadwal: p.jadwal, durasi: p.durasi,
      harga_mulai: p.harga_mulai == null ? "" : String(p.harga_mulai), satuan_harga: p.satuan_harga, catatan_harga: p.catatan_harga,
      termasuk: p.termasuk, susunan_acara: p.susunan_acara, foto_url: p.foto_url, is_published: p.is_published, sort_order: p.sort_order,
    });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() { setEditingId(null); setSlugManual(false); setForm(kosong); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const harga = form.harga_mulai.replace(/[^0-9]/g, "");
    const payload = {
      nama: form.nama.trim().slice(0, 120),
      slug: buatSlug(form.slug || form.nama),
      jenis: form.jenis,
      ringkasan: form.ringkasan.trim().slice(0, 600),
      jadwal: form.jadwal.trim().slice(0, 120),
      durasi: form.durasi.trim().slice(0, 60),
      harga_mulai: harga ? Number(harga) : null,
      satuan_harga: form.satuan_harga.trim().slice(0, 30),
      catatan_harga: form.catatan_harga.trim().slice(0, 120),
      termasuk: form.termasuk.trim().slice(0, 2000),
      susunan_acara: form.susunan_acara.trim().slice(0, 3000),
      foto_url: form.foto_url,
      is_published: form.is_published,
      sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
    };
    if (payload.nama.length < 2) return setMsg({ type: "err", text: "Nama paket wajib diisi." });
    if (!payload.slug) return setMsg({ type: "err", text: "Alamat halaman (slug) wajib diisi." });
    setSaving(true);
    const { error } = editingId
      ? await supabase.from(TABEL).update(payload).eq("id", editingId)
      : await supabase.from(TABEL).insert(payload);
    setSaving(false);
    if (error) {
      const duplikat = error.code === "23505";
      return setMsg({ type: "err", text: duplikat ? "Alamat halaman (slug) sudah dipakai paket lain. Ganti sedikit." : "Gagal menyimpan: " + error.message });
    }
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
    if (!confirm(`Hapus paket "${p.nama}"? Riwayat pesanan paket ini tetap tersimpan.`)) return;
    const { error } = await supabase.from(TABEL).delete().eq("id", p.id);
    if (error) return setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    await hapusFotoSumitra(p.foto_url);
    load();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={save} className={kartu + " space-y-4"}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-white">{editingId ? "Edit Paket" : "Tambah Paket Wisata"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tampil di section Paket dan punya halaman detail dengan formulir pemesanan.</p>
          </div>
          {editingId && (
            <button type="button" onClick={reset} className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Batal
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className={labelCls}>Nama paket
            <input className={inputCls} value={form.nama} onChange={(e) => ubah("nama", e.target.value)} maxLength={120} placeholder="Open Trip Bromo" />
          </label>
          <label className={labelCls}>Jenis
            <select className={inputCls} value={form.jenis} onChange={(e) => ubah("jenis", e.target.value as JenisPaket)}>
              {JENIS_PAKET.map((j) => <option key={j.id} value={j.id}>{j.label}</option>)}
            </select>
          </label>
        </div>
        <label className={labelCls}>Alamat halaman
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0">/sumitra/paket/</span>
            <input className={inputCls} value={form.slug} onChange={(e) => { setSlugManual(true); ubah("slug", e.target.value); }} maxLength={80} />
          </div>
        </label>
        <label className={labelCls}>Ringkasan singkat
          <textarea className={inputCls + " resize-y"} rows={2} value={form.ringkasan} onChange={(e) => ubah("ringkasan", e.target.value)} maxLength={600} />
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className={labelCls}>Jadwal keberangkatan
            <input className={inputCls} value={form.jadwal} onChange={(e) => ubah("jadwal", e.target.value)} maxLength={120} placeholder="Berangkat hampir setiap hari" />
          </label>
          <label className={labelCls}>Durasi
            <input className={inputCls} value={form.durasi} onChange={(e) => ubah("durasi", e.target.value)} maxLength={60} placeholder="1 hari / 3 hari 2 malam" />
          </label>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className={labelCls}>Harga mulai (Rp)
            <input className={inputCls} inputMode="numeric" value={form.harga_mulai} onChange={(e) => ubah("harga_mulai", e.target.value)} placeholder="Kosongkan bila belum pasti" />
          </label>
          <label className={labelCls}>Per
            <input className={inputCls} value={form.satuan_harga} onChange={(e) => ubah("satuan_harga", e.target.value)} maxLength={30} placeholder="orang" />
          </label>
          <label className={labelCls}>Catatan harga
            <input className={inputCls} value={form.catatan_harga} onChange={(e) => ubah("catatan_harga", e.target.value)} maxLength={120} placeholder="Harga low season" />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className={labelCls}>Sudah termasuk (satu baris = satu fasilitas)
            <textarea className={inputCls + " resize-y"} rows={4} value={form.termasuk} onChange={(e) => ubah("termasuk", e.target.value)} placeholder={"Transportasi\nTiket masuk\nPemandu"} />
          </label>
          <label className={labelCls}>Susunan acara (satu baris = satu kegiatan)
            <textarea className={inputCls + " resize-y"} rows={4} value={form.susunan_acara} onChange={(e) => ubah("susunan_acara", e.target.value)} placeholder={"00.30 Berangkat dari Malang\n04.30 Melihat matahari terbit"} />
          </label>
        </div>
        <FieldFoto label="Foto paket" value={form.foto_url} onChange={(v) => ubah("foto_url", v)} folder="paket" />
        <TayangDanUrutan label="Tayangkan di halaman Sumitra" tayang={form.is_published} urutan={form.sort_order}
          onTayang={(v) => ubah("is_published", v)} onUrutan={(v) => ubah("sort_order", v)} />
        <Pesan msg={msg} />
        <button type="submit" disabled={saving} className={tombolUtama}>
          {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Paket"}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-extrabold text-white">Daftar Paket ({items.length})</h2>
        {items.length === 0 && <p className="text-sm text-slate-400">Belum ada paket.</p>}
        {items.map((p) => (
          <div key={p.id} className={kartu + " flex flex-col sm:flex-row gap-3 sm:items-center justify-between"}>
            <div className="flex gap-3 items-center min-w-0">
              <div className="w-16 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                {p.foto_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.foto_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-white">{p.nama}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-800 text-amber-400">{LABEL_JENIS[p.jenis]}</span>
                  <StatusBadge tayang={p.is_published} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {teksHarga(p.harga_mulai, p.satuan_harga) ?? "Harga belum diisi"} · /sumitra/paket/{p.slug}
                </p>
              </div>
            </div>
            <AksiBaris tayang={p.is_published} onToggle={() => toggle(p)} onEdit={() => startEdit(p)} onHapus={() => hapus(p)} />
          </div>
        ))}
      </div>
    </div>
  );
}
