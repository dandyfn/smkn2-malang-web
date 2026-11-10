"use client";

// Panel admin ulasan KADOEA:
// 1) menyetujui ulasan kiriman pengunjung, 2) membalas ulasan pengunjung,
// 3) menambah ulasan salinan dari Google Maps.
import { useCallback, useEffect, useState } from "react";
import { Check, MessageSquareReply, Plus, Save, Star, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { UlasanRow } from "@/lib/kadoea";
import { inputCls, Pesan, StatusBadge, AksiBaris, TayangDanUrutan, type Msg } from "./ui";

const TABEL = "kadoea_ulasan";

// Ambil semua baris (termasuk yang disembunyikan) untuk ditampilkan di panel admin
const ambil = () => supabase.from(TABEL).select("*").order("sort_order").order("created_at", { ascending: false });

type Filter = "menunggu" | "belum-dibalas" | "semua";
type Form = {
  nama: string; rating: number; isi: string; waktu: string; profile_url: string;
  is_published: boolean; sort_order: number;
};
const kosong: Form = { nama: "", rating: 5, isi: "", waktu: "", profile_url: "", is_published: true, sort_order: 0 };

// Ulasan kiriman pengunjung yang belum ditayangkan = perlu dicek admin
const perluSetuju = (u: UlasanRow) => u.sumber === "pengunjung" && !u.is_published;
// Balasan hanya untuk ulasan dari pengunjung website (ulasan Google dibalas langsung di Google Maps)
const bisaDibalas = (u: UlasanRow) => u.sumber === "pengunjung";

export default function UlasanPanel() {
  const [items, setItems] = useState<UlasanRow[]>([]);
  const [filter, setFilter] = useState<Filter>("menunggu");
  const [form, setForm] = useState<Form>(kosong);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  // Form balasan (hanya satu ulasan yang dibalas dalam satu waktu)
  const [balasId, setBalasId] = useState<string | null>(null);
  const [balasTeks, setBalasTeks] = useState("");
  const [balasSaving, setBalasSaving] = useState(false);

  // Hasil kueri diterapkan ke state di dalam .then (bukan langsung di efek)
  const terapkan = useCallback(({ data, error }: { data: unknown; error: { message: string } | null }) => {
    if (error) setMsg({ type: "err", text: "Gagal memuat ulasan: " + error.message });
    else setItems((data ?? []) as UlasanRow[]);
  }, []);
  const load = useCallback(() => ambil().then(terapkan), [terapkan]);

  useEffect(() => {
    ambil().then(terapkan);
  }, [terapkan]);

  const menunggu = items.filter(perluSetuju);
  const belumDibalas = items.filter((u) => bisaDibalas(u) && !u.balasan);
  const tampil = filter === "menunggu" ? menunggu : filter === "belum-dibalas" ? belumDibalas : items;

  /* ---------- tambah / edit ulasan Google ---------- */
  function startEdit(u: UlasanRow) {
    setEditingId(u.id);
    setForm({
      nama: u.nama, rating: u.rating, isi: u.isi, waktu: u.waktu ?? "", profile_url: u.profile_url ?? "",
      is_published: u.is_published, sort_order: u.sort_order,
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
      rating: form.rating,
      isi: form.isi.trim().slice(0, 1500),
      waktu: form.waktu.trim().slice(0, 40) || null,
      profile_url: form.profile_url.trim() || null,
      // ulasan yang ditambah admin = salinan Google Maps; ulasan pengunjung tetap "pengunjung"
      ...(editingId ? {} : { sumber: "google" as const }),
      is_published: form.is_published,
      sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
    };
    if (!payload.nama || !payload.isi) return setMsg({ type: "err", text: "Nama dan isi ulasan wajib diisi." });
    if (payload.profile_url && !/^https?:\/\//i.test(payload.profile_url)) {
      return setMsg({ type: "err", text: "Tautan profil harus diawali http:// atau https://" });
    }
    setSaving(true);
    const { error } = editingId
      ? await supabase.from(TABEL).update(payload).eq("id", editingId)
      : await supabase.from(TABEL).insert(payload);
    setSaving(false);
    if (error) return setMsg({ type: "err", text: "Gagal menyimpan: " + error.message });
    setMsg({ type: "ok", text: editingId ? "Ulasan diperbarui." : "Ulasan ditambahkan." });
    reset();
    load();
  }

  /* ---------- setujui / sembunyikan / hapus ---------- */
  async function toggle(u: UlasanRow) {
    const { error } = await supabase.from(TABEL).update({ is_published: !u.is_published }).eq("id", u.id);
    if (error) setMsg({ type: "err", text: "Gagal mengubah status: " + error.message });
    else load();
  }
  async function hapus(u: UlasanRow) {
    if (!confirm(`Hapus ulasan dari "${u.nama}"?`)) return;
    const { error } = await supabase.from(TABEL).delete().eq("id", u.id);
    if (error) setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    else load();
  }

  /* ---------- balasan ---------- */
  function bukaBalas(u: UlasanRow) {
    setBalasId(u.id);
    setBalasTeks(u.balasan ?? "");
    setMsg(null);
  }
  function tutupBalas() { setBalasId(null); setBalasTeks(""); }

  async function simpanBalasan(u: UlasanRow, setujuiJuga: boolean) {
    const teks = balasTeks.trim().slice(0, 1500);
    if (!teks) return setMsg({ type: "err", text: "Tulis balasan terlebih dahulu." });
    setBalasSaving(true);
    const { error } = await supabase
      .from(TABEL)
      .update({ balasan: teks, dibalas_at: new Date().toISOString(), ...(setujuiJuga ? { is_published: true } : {}) })
      .eq("id", u.id);
    setBalasSaving(false);
    if (error) return setMsg({ type: "err", text: "Gagal menyimpan balasan: " + error.message });
    setMsg({ type: "ok", text: setujuiJuga ? "Ulasan disetujui dan balasan disimpan." : "Balasan disimpan." });
    tutupBalas();
    load();
  }

  async function hapusBalasan(u: UlasanRow) {
    if (!confirm(`Hapus balasan untuk ulasan "${u.nama}"?`)) return;
    const { error } = await supabase.from(TABEL).update({ balasan: null, dibalas_at: null }).eq("id", u.id);
    if (error) setMsg({ type: "err", text: "Gagal menghapus balasan: " + error.message });
    else load();
  }

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "menunggu", label: `Menunggu persetujuan (${menunggu.length})` },
    { id: "belum-dibalas", label: `Belum dibalas (${belumDibalas.length})` },
    { id: "semua", label: "Semua" },
  ];

  return (
    <div className="space-y-8">
      {/* FORM TAMBAH / EDIT ULASAN GOOGLE */}
      <form onSubmit={save} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-white">{editingId ? "Edit Ulasan" : "Tambah Ulasan dari Google Maps"}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Salin ulasan apa adanya dari Google Maps KADOEA. Ulasan dari pengunjung website masuk otomatis ke daftar di bawah.
            </p>
          </div>
          {editingId && (
            <button type="button" onClick={reset} className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Batal edit
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Nama penulis (sesuai di Maps)" maxLength={80}
            value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          <select className={inputCls} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} bintang</option>)}
          </select>
        </div>
        <textarea className={inputCls + " resize-y"} rows={4} maxLength={1500} placeholder="Isi ulasan (tempel apa adanya dari Google Maps)"
          value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Tautan profil penulis di Maps (opsional)"
            value={form.profile_url} onChange={(e) => setForm({ ...form, profile_url: e.target.value })} />
          <input className={inputCls} placeholder='Waktu, misalnya "2 bulan lalu" (opsional)' maxLength={40}
            value={form.waktu} onChange={(e) => setForm({ ...form, waktu: e.target.value })} />
        </div>
        <TayangDanUrutan tayang={form.is_published} urutan={form.sort_order}
          onTayang={(v) => setForm({ ...form, is_published: v })} onUrutan={(v) => setForm({ ...form, sort_order: v })} />

        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-xl transition">
          {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Ulasan"}
        </button>
      </form>

      {/* DAFTAR ULASAN */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-extrabold text-white">Daftar Ulasan ({items.length})</h2>
          <div className="flex flex-wrap gap-1.5">
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

        <Pesan msg={msg} />

        {tampil.length === 0 && (
          <p className="text-sm text-slate-400">
            {filter === "menunggu" ? "Tidak ada ulasan baru yang perlu disetujui."
              : filter === "belum-dibalas" ? "Semua ulasan pengunjung sudah dibalas."
              : "Belum ada ulasan."}
          </p>
        )}

        {tampil.map((u) => (
          <div key={u.id} className={`bg-slate-900 border rounded-2xl p-4 space-y-3 ${perluSetuju(u) ? "border-amber-500/40" : "border-slate-800"}`}>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-start justify-between">
              {/* Isi ulasan */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-white">{u.nama}</span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < u.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                    ))}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    u.sumber === "pengunjung" ? "bg-sky-500/15 text-sky-400" : "bg-blue-500/15 text-blue-300"
                  }`}>
                    {u.sumber === "pengunjung" ? "Dari pengunjung" : "Google Maps"}
                  </span>
                  {perluSetuju(u) ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400">Menunggu persetujuan</span>
                  ) : (
                    <StatusBadge tayang={u.is_published} />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">{new Date(u.created_at).toLocaleDateString("id-ID")}</p>
                <p className="text-xs text-slate-300 whitespace-pre-line break-words">{u.isi}</p>
              </div>

              {/* Tombol aksi */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {bisaDibalas(u) && balasId !== u.id && (
                  <button onClick={() => bukaBalas(u)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-sky-500/40 text-sky-300 rounded-lg hover:bg-sky-500/10">
                    <MessageSquareReply className="w-4 h-4" /> {u.balasan ? "Edit balasan" : "Balas"}
                  </button>
                )}
                {perluSetuju(u) ? (
                  <>
                    <button onClick={() => toggle(u)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg">
                      <Check className="w-4 h-4" /> Setujui
                    </button>
                    <button onClick={() => hapus(u)}
                      className="px-3 py-1.5 text-xs font-semibold border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10">
                      Tolak & hapus
                    </button>
                  </>
                ) : (
                  <AksiBaris tayang={u.is_published} onToggle={() => toggle(u)} onEdit={() => startEdit(u)} onHapus={() => hapus(u)} />
                )}
              </div>
            </div>

            {/* Balasan yang sudah ada */}
            {u.balasan && balasId !== u.id && (
              <div className="ml-0 sm:ml-6 border-l-2 border-amber-400 bg-slate-950/60 rounded-r-xl px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase text-amber-400">
                    Balasan KADOEA{u.dibalas_at && ` · ${new Date(u.dibalas_at).toLocaleDateString("id-ID")}`}
                  </p>
                  <button onClick={() => hapusBalasan(u)} className="text-slate-500 hover:text-red-400" aria-label="Hapus balasan">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-line break-words mt-1">{u.balasan}</p>
              </div>
            )}

            {/* Form tulis / edit balasan */}
            {balasId === u.id && (
              <div className="ml-0 sm:ml-6 space-y-2">
                <textarea
                  className={inputCls + " resize-y"}
                  rows={3}
                  maxLength={1500}
                  autoFocus
                  placeholder={`Tulis balasan untuk ${u.nama}...`}
                  value={balasTeks}
                  onChange={(e) => setBalasTeks(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => simpanBalasan(u, false)} disabled={balasSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 rounded-lg">
                    <Save className="w-4 h-4" /> {balasSaving ? "Menyimpan..." : "Simpan Balasan"}
                  </button>
                  {perluSetuju(u) && (
                    <button onClick={() => simpanBalasan(u, true)} disabled={balasSaving}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 rounded-lg">
                      <Check className="w-4 h-4" /> Setujui & Balas
                    </button>
                  )}
                  <button onClick={tutupBalas} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
