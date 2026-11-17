"use client";

// Pengaturan umum halaman Sumitra: kontak, jam buka, syarat pembayaran, logo, dan foto utama.
import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { PengaturanRow } from "@/lib/sumitra";
import { nomorWaInternasional } from "@/data/sumitra";
import { inputCls, labelCls, kartu, tombolUtama, Pesan, FieldFoto, type Msg } from "./bersama";

type Form = Omit<PengaturanRow, "id" | "updated_at">;
const kosong: Form = {
  nomor_wa: "", instagram: "", facebook: "", jam_buka: "", besaran_dp: "", aturan_tambahan: "",
  logo_url: null, hero_foto_url: null, tentang_foto_url: null,
};
const ambil = () => supabase.from("sumitra_pengaturan").select("*").eq("id", 1).maybeSingle();

export default function PengaturanPanel() {
  const [form, setForm] = useState<Form>(kosong);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  const terapkan = useCallback(({ data, error }: { data: unknown; error: { message: string } | null }) => {
    if (error) return setMsg({ type: "err", text: "Gagal memuat pengaturan: " + error.message });
    if (data) {
      const r = data as PengaturanRow;
      setForm({
        nomor_wa: r.nomor_wa, instagram: r.instagram, facebook: r.facebook, jam_buka: r.jam_buka, besaran_dp: r.besaran_dp,
        aturan_tambahan: r.aturan_tambahan, logo_url: r.logo_url, hero_foto_url: r.hero_foto_url, tentang_foto_url: r.tentang_foto_url,
      });
    }
  }, []);
  useEffect(() => {
    ambil().then(terapkan);
  }, [terapkan]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const wa = nomorWaInternasional(form.nomor_wa);
    if (form.nomor_wa && (wa.length < 10 || wa.length > 15)) {
      return setMsg({ type: "err", text: "Nomor WhatsApp belum benar. Contoh: 081234567890." });
    }
    const tautan = (s: string) => {
      const t = s.trim();
      return t && !/^https?:\/\//i.test(t) ? "https://" + t : t;
    };
    setSaving(true);
    const { error } = await supabase.from("sumitra_pengaturan").upsert({
      id: 1,
      ...form,
      nomor_wa: wa,
      instagram: tautan(form.instagram),
      facebook: tautan(form.facebook),
      jam_buka: form.jam_buka.trim().slice(0, 120),
      besaran_dp: form.besaran_dp.trim().slice(0, 60),
      aturan_tambahan: form.aturan_tambahan.trim().slice(0, 1500),
    });
    setSaving(false);
    if (error) return setMsg({ type: "err", text: "Gagal menyimpan: " + error.message });
    setMsg({ type: "ok", text: "Pengaturan disimpan. Halaman Sumitra diperbarui paling lambat 1 menit." });
    ambil().then(terapkan);
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <section className={kartu + " space-y-4"}>
        <h2 className="font-extrabold text-white">Kontak</h2>
        <label className={labelCls}>Nomor WhatsApp admin (tujuan pesanan dari website)
          <input className={inputCls} inputMode="tel" value={form.nomor_wa} onChange={(e) => setForm({ ...form, nomor_wa: e.target.value })} placeholder="081234567890" />
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className={labelCls}>Tautan Instagram
            <input className={inputCls} value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="instagram.com/sumitrakelanawisata" />
          </label>
          <label className={labelCls}>Tautan Facebook
            <input className={inputCls} value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} placeholder="facebook.com/..." />
          </label>
        </div>
        <label className={labelCls}>Jam buka kantor
          <input className={inputCls} value={form.jam_buka} onChange={(e) => setForm({ ...form, jam_buka: e.target.value })} maxLength={120} placeholder="Senin–Jumat, 07.00–15.00" />
        </label>
      </section>

      <section className={kartu + " space-y-4"}>
        <div>
          <h2 className="font-extrabold text-white">Syarat pembayaran &amp; pembatalan</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tiga aturan dari wawancara (DP di awal, lunas sebelum berangkat, DP tidak kembali jika batal) selalu tampil. Isian di bawah melengkapinya.
          </p>
        </div>
        <label className={labelCls}>Besaran DP
          <input className={inputCls} value={form.besaran_dp} onChange={(e) => setForm({ ...form, besaran_dp: e.target.value })} maxLength={60} placeholder="50% dari total biaya" />
        </label>
        <label className={labelCls}>Aturan tambahan (satu baris = satu poin)
          <textarea className={inputCls + " resize-y"} rows={3} value={form.aturan_tambahan} onChange={(e) => setForm({ ...form, aturan_tambahan: e.target.value })}
            placeholder="Pembatalan lebih dari 7 hari sebelum keberangkatan ..." />
        </label>
      </section>

      <section className={kartu + " space-y-4"}>
        <h2 className="font-extrabold text-white">Logo &amp; foto utama</h2>
        <FieldFoto label="Logo Sumitra (kosong = logo SMKN 2 Malang)" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} folder="situs" rasio="aspect-square max-w-[120px]" />
        <FieldFoto label="Foto latar hero (paling atas halaman)" value={form.hero_foto_url} onChange={(v) => setForm({ ...form, hero_foto_url: v })} folder="situs" />
        <FieldFoto label="Foto section Tentang" value={form.tentang_foto_url} onChange={(v) => setForm({ ...form, tentang_foto_url: v })} folder="situs" rasio="aspect-[4/3]" />
      </section>

      <Pesan msg={msg} />
      <button type="submit" disabled={saving} className={tombolUtama + " w-full sm:w-auto"}>
        <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Pengaturan"}
      </button>
    </form>
  );
}
