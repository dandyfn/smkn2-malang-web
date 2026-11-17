"use client";

// Section Testimoni: cerita peserta + foto, balasan admin, dan formulir kirim testimoni.
// Testimoni pengunjung baru tampil setelah disetujui admin.
import { useState } from "react";
import Image from "next/image";
import { Star, Send, ImagePlus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { unggahFotoSumitra } from "@/lib/fotoSumitra";
import { catatKirim, masihJeda } from "@/components/kadoea/kirimTamu";
import type { Testimoni } from "@/data/sumitra";
import { CorakPos } from "./Corak";

const KUNCI = "sumitra_testimoni_terakhir";
const inputGelap =
  "w-full mt-1.5 bg-slate-900 border border-slate-700 rounded-xl p-3 text-[15px] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition";

function Bintang({ nilai }: { nilai: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${nilai} dari 5 bintang`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} aria-hidden className={`w-4 h-4 ${i < nilai ? "fill-amber-500 text-amber-500" : "text-slate-300"}`} />
      ))}
    </div>
  );
}

function FormTestimoni({ daftarPerjalanan }: { daftarPerjalanan: string[] }) {
  const [nama, setNama] = useState("");
  const [perjalanan, setPerjalanan] = useState("");
  const [rating, setRating] = useState(5);
  const [isi, setIsi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [pratinjau, setPratinjau] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot
  const [kirimProses, setKirimProses] = useState(false);
  const [pesan, setPesan] = useState<{ ok: boolean; teks: string } | null>(null);

  function pilihFoto(f: File | null) {
    if (pratinjau) URL.revokeObjectURL(pratinjau);
    setFoto(f);
    setPratinjau(f ? URL.createObjectURL(f) : null);
  }

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setPesan(null);
    if (website) return;
    if (!nama.trim()) return setPesan({ ok: false, teks: "Isi namamu terlebih dahulu." });
    if (isi.trim().length < 5) return setPesan({ ok: false, teks: "Ceritamu terlalu pendek (minimal 5 karakter)." });
    if (masihJeda(KUNCI)) return setPesan({ ok: false, teks: "Tunggu sebentar sebelum mengirim testimoni lagi." });

    setKirimProses(true);
    try {
      const fotoUrl = foto ? await unggahFotoSumitra(foto, "testimoni", 1400) : null;
      const { error } = await supabase.from("sumitra_testimoni").insert({
        nama: nama.trim().slice(0, 80),
        perjalanan: perjalanan.trim().slice(0, 120),
        rating,
        isi: isi.trim().slice(0, 1500),
        foto_url: fotoUrl,
        is_published: false,
      });
      if (error) throw new Error(error.message);
      catatKirim(KUNCI);
      setNama(""); setPerjalanan(""); setRating(5); setIsi(""); pilihFoto(null);
      setPesan({ ok: true, teks: "Terima kasih! Testimonimu akan tampil setelah disetujui admin Sumitra." });
    } catch (err) {
      console.error("Gagal mengirim testimoni:", err);
      const detail = process.env.NODE_ENV === "development" && err instanceof Error ? ` (${err.message})` : "";
      setPesan({ ok: false, teks: `Maaf, testimoni gagal dikirim. Coba lagi nanti.${detail}` });
    } finally {
      setKirimProses(false);
    }
  }

  return (
    <form onSubmit={kirim} className="bg-slate-950 rounded-[20px] p-6 flex flex-col gap-3 self-start">
      <h3 className="text-xl font-extrabold text-white">Bagikan pengalamanmu</h3>
      <label className="text-[13px] font-bold text-slate-300">
        Nama
        <input className={inputGelap} value={nama} onChange={(e) => setNama(e.target.value)} maxLength={80} autoComplete="name" />
      </label>
      <label className="text-[13px] font-bold text-slate-300">
        Perjalanan yang diikuti (opsional)
        <input className={inputGelap} value={perjalanan} onChange={(e) => setPerjalanan(e.target.value)} maxLength={120}
          list="daftar-perjalanan-sumitra" placeholder="Misalnya Open Trip Bromo" />
        <datalist id="daftar-perjalanan-sumitra">
          {daftarPerjalanan.map((p) => <option key={p} value={p} />)}
        </datalist>
      </label>
      <fieldset>
        <legend className="text-[13px] font-bold text-slate-300">Penilaian</legend>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} bintang`} aria-pressed={rating === n}
              className="p-1.5 rounded-lg hover:bg-slate-800">
              <Star className={`w-6 h-6 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} aria-hidden />
            </button>
          ))}
        </div>
      </fieldset>
      <label className="text-[13px] font-bold text-slate-300">
        Ceritamu
        <textarea rows={3} className={inputGelap + " resize-y"} value={isi} onChange={(e) => setIsi(e.target.value)} maxLength={1500} />
      </label>
      <div className="text-[13px] font-bold text-slate-300">
        Foto perjalanan (opsional)
        {pratinjau ? (
          <div className="relative mt-1.5 w-full aspect-video rounded-xl overflow-hidden bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pratinjau} alt="Pratinjau foto" className="w-full h-full object-cover" />
            <button type="button" onClick={() => pilihFoto(null)} aria-label="Hapus foto"
              className="absolute top-2 right-2 p-2 rounded-lg bg-slate-950/80 text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="mt-1.5 flex items-center justify-center gap-2 border-2 border-dashed border-slate-700 rounded-xl p-4 text-slate-300 cursor-pointer hover:border-amber-400">
            <ImagePlus className="w-5 h-5 text-amber-400" aria-hidden /> Pilih foto
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => pilihFoto(e.target.files?.[0] ?? null)} />
          </label>
        )}
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"
        value={website} onChange={(e) => setWebsite(e.target.value)} />
      {pesan && <p className={`text-sm font-semibold ${pesan.ok ? "text-emerald-400" : "text-rose-400"}`} role="status">{pesan.teks}</p>}
      <button type="submit" disabled={kirimProses}
        className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-slate-950 font-extrabold py-3.5 rounded-xl transition">
        <Send className="w-4 h-4" aria-hidden /> {kirimProses ? "Mengirim..." : "Kirim Testimoni"}
      </button>
    </form>
  );
}

export default function SumitraTestimoni({ testimoni, daftarPerjalanan }: { testimoni: Testimoni[]; daftarPerjalanan: string[] }) {
  return (
    <section id="testimoni" className="relative overflow-hidden bg-teal-50 text-slate-900 px-4 sm:px-6 py-20 sm:py-24">
      <CorakPos />
      <div className="relative max-w-[1200px] mx-auto">
        <p className="text-[13px] font-extrabold tracking-[0.08em] text-teal-700">TESTIMONI</p>
        <h2 className="mt-2.5 mb-8 text-3xl sm:text-[40px] leading-tight font-extrabold">Cerita dari peserta</h2>
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] items-start">
          {testimoni.length === 0 && (
            <div className="bg-white/80 border border-dashed border-teal-300 rounded-[20px] p-8 text-slate-600">
              Belum ada testimoni yang ditampilkan. Jadilah yang pertama berbagi cerita perjalananmu bersama Sumitra.
            </div>
          )}
          {testimoni.map((t) => (
            <article key={t.id} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden">
              {t.fotoUrl && (
                <div className="relative aspect-video bg-slate-200">
                  <Image src={t.fotoUrl} alt={`Foto perjalanan ${t.nama}`} fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />
                </div>
              )}
              <div className="p-5 sm:p-6">
                <Bintang nilai={t.rating} />
                <p className="mt-2.5 mb-3.5 text-[15px] leading-relaxed text-slate-700 whitespace-pre-line">{t.isi}</p>
                <p className="font-extrabold text-sm">
                  {t.nama}
                  {t.perjalanan && <span className="font-semibold text-slate-500"> · {t.perjalanan}</span>}
                </p>
                {t.balasan && (
                  <div className="mt-3.5 border-l-[3px] border-amber-400 bg-amber-50 rounded-r-xl px-3.5 py-3">
                    <p className="text-[11px] font-extrabold tracking-[0.06em] text-amber-800">BALASAN SUMITRA</p>
                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{t.balasan}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
          <FormTestimoni daftarPerjalanan={daftarPerjalanan} />
        </div>
      </div>
    </section>
  );
}
