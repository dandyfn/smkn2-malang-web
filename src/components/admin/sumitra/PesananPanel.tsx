"use client";

// Daftar pesanan dari formulir website (pengganti formulir kertas).
// Admin mengubah status: Baru -> DP -> Lunas -> Selesai / Batal, menulis catatan, dan mengunduh rekap.
import { useCallback, useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { PesananRow, StatusPesanan } from "@/lib/sumitra";
import { nomorWaInternasional } from "@/data/sumitra";
import { inputCls, kartu, Pesan, PilFilter, formatWaktu, type Msg, type HasilKueri } from "./bersama";

const TABEL = "sumitra_pesanan";
const ambil = () => supabase.from(TABEL).select("*").order("created_at", { ascending: false }).limit(500);

const STATUS: { id: StatusPesanan; label: string; warna: string }[] = [
  { id: "baru", label: "Baru", warna: "bg-blue-900 text-blue-100" },
  { id: "dp", label: "DP", warna: "bg-amber-900 text-amber-100" },
  { id: "lunas", label: "Lunas", warna: "bg-teal-900 text-teal-100" },
  { id: "selesai", label: "Selesai", warna: "bg-slate-700 text-slate-100" },
  { id: "batal", label: "Batal", warna: "bg-red-900 text-red-100" },
];
const LABEL_STATUS = Object.fromEntries(STATUS.map((s) => [s.id, s.label])) as Record<StatusPesanan, string>;

function rincian(p: PesananRow): string[] {
  const r: string[] = [];
  if (p.tanggal) r.push(`Tanggal ${new Date(p.tanggal + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`);
  if (p.jumlah) r.push(`${p.jumlah} orang`);
  if (p.lama) r.push(`Lama ${p.lama}`);
  if (p.lokasi) r.push(`Jemput di ${p.lokasi}`);
  if (p.cara_bayar) r.push(`Bayar ${p.cara_bayar}`);
  return r;
}

function unduhRekap(items: PesananRow[]) {
  const sekarang = new Date();
  const awalBulan = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1);
  const bulanIni = items.filter((p) => new Date(p.created_at) >= awalBulan);
  const kolom = ["Kode", "Masuk", "Jenis", "Paket/Layanan", "Nama", "No. WhatsApp", "Tanggal", "Jumlah", "Lama", "Lokasi", "Cara bayar", "Catatan", "Status", "Catatan admin"];
  const sel = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const baris = bulanIni.map((p) => [
    p.kode, formatWaktu(p.created_at), p.jenis, p.item_nama, p.nama, p.no_wa, p.tanggal ?? "", p.jumlah ?? "", p.lama, p.lokasi,
    p.cara_bayar, p.catatan, LABEL_STATUS[p.status], p.catatan_admin,
  ].map(sel).join(";"));
  // BOM + pemisah titik koma agar langsung rapi saat dibuka di Excel versi Indonesia
  const csv = "﻿" + [kolom.map(sel).join(";"), ...baris].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `rekap-pesanan-sumitra-${sekarang.getFullYear()}-${String(sekarang.getMonth() + 1).padStart(2, "0")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PesananPanel() {
  const [items, setItems] = useState<PesananRow[]>([]);
  const [filter, setFilter] = useState<StatusPesanan | "semua">("baru");
  const [catatan, setCatatan] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<Msg>(null);

  const terapkan = useCallback(({ data, error }: HasilKueri) => {
    if (error) setMsg({ type: "err", text: "Gagal memuat pesanan: " + error.message });
    else setItems((data ?? []) as PesananRow[]);
  }, []);
  const load = useCallback(() => ambil().then(terapkan), [terapkan]);
  useEffect(() => {
    ambil().then(terapkan);
  }, [terapkan]);

  const hitung = (s: StatusPesanan) => items.filter((p) => p.status === s).length;
  const tampil = filter === "semua" ? items : items.filter((p) => p.status === filter);

  async function ubahStatus(p: PesananRow, status: StatusPesanan) {
    const { error } = await supabase.from(TABEL).update({ status }).eq("id", p.id);
    if (error) return setMsg({ type: "err", text: "Gagal mengubah status: " + error.message });
    setMsg({ type: "ok", text: `${p.kode} diubah menjadi ${LABEL_STATUS[status]}.` });
    load();
  }
  async function simpanCatatan(p: PesananRow) {
    const teks = (catatan[p.id] ?? p.catatan_admin).slice(0, 1000);
    const { error } = await supabase.from(TABEL).update({ catatan_admin: teks }).eq("id", p.id);
    if (error) return setMsg({ type: "err", text: "Gagal menyimpan catatan: " + error.message });
    setMsg({ type: "ok", text: `Catatan ${p.kode} disimpan.` });
    load();
  }
  async function hapus(p: PesananRow) {
    if (!confirm(`Hapus pesanan ${p.kode} dari ${p.nama}? Data yang dihapus tidak masuk rekap.`)) return;
    const { error } = await supabase.from(TABEL).delete().eq("id", p.id);
    if (error) setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    else load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-extrabold text-white">Pesanan ({items.length})</h2>
          <p className="text-xs text-slate-400">Masuk otomatis dari formulir pemesanan di website.</p>
        </div>
        <button type="button" onClick={() => unduhRekap(items)}
          className="inline-flex items-center gap-2 border border-slate-700 text-slate-200 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold min-h-11">
          <Download className="w-4 h-4" /> Unduh rekap bulan ini (Excel)
        </button>
      </div>

      <PilFilter
        pilihan={[
          ...STATUS.map((s) => ({ id: s.id, label: `${s.label} (${hitung(s.id)})` })),
          { id: "semua" as const, label: "Semua" },
        ]}
        aktif={filter}
        onPilih={setFilter}
      />
      <Pesan msg={msg} />

      {tampil.length === 0 && <p className="text-sm text-slate-400">Tidak ada pesanan dengan status ini.</p>}

      {tampil.map((p) => {
        const st = STATUS.find((s) => s.id === p.status)!;
        const nomor = nomorWaInternasional(p.no_wa);
        const chat = nomor
          ? `https://wa.me/${nomor}?text=${encodeURIComponent(`Halo ${p.nama}, kami dari Sumitra Kelana Wisata terkait pesanan ${p.kode} (${p.item_nama}).`)}`
          : null;
        return (
          <article key={p.id} className={kartu + " space-y-3"}>
            <div className="flex justify-between items-center gap-2">
              <p className="text-xs font-bold text-slate-400">{p.kode} · masuk {formatWaktu(p.created_at)}</p>
              <span className={`text-[11px] font-black px-2 py-1 rounded-md uppercase ${st.warna}`}>{st.label}</span>
            </div>
            <div>
              <p className="font-extrabold text-white text-base">{p.nama}</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {p.item_nama} <span className="text-slate-500">({p.jenis === "paket" ? "paket" : "layanan"})</span>
                <br />
                {rincian(p).join(" · ") || "Tanpa rincian"}
                <br />
                <span className="text-slate-400">WA: {p.no_wa}</span>
              </p>
              {p.catatan && <p className="text-sm text-slate-300 mt-1">Catatan pemesan: {p.catatan}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              {chat && (
                <a href={chat} target="_blank" rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] text-center bg-teal-700 hover:bg-teal-600 text-white font-extrabold text-sm py-3 rounded-xl">
                  Chat WA
                </a>
              )}
              <label className="flex-1 min-w-[140px]">
                <span className="sr-only">Ubah status {p.kode}</span>
                <select value={p.status} onChange={(e) => ubahStatus(p, e.target.value as StatusPesanan)} className={inputCls + " font-bold h-full"}>
                  {STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>
              <button type="button" onClick={() => hapus(p)} aria-label={`Hapus pesanan ${p.kode}`}
                className="p-3 border border-red-500/30 rounded-xl hover:bg-red-500/10">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                {p.status === "batal" ? "Catatan pembatalan" : "Catatan admin"} (misalnya DP diterima tanggal berapa, sisa pembayaran)
                <textarea rows={2} className={inputCls + " mt-1.5 resize-y"}
                  value={catatan[p.id] ?? p.catatan_admin}
                  onChange={(e) => setCatatan({ ...catatan, [p.id]: e.target.value })} />
              </label>
              {(catatan[p.id] ?? p.catatan_admin) !== p.catatan_admin && (
                <button type="button" onClick={() => simpanCatatan(p)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg">
                  Simpan catatan
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
