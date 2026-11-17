"use client";

// Section FAQ Sumitra dengan latar neural network interaktif + formulir pertanyaan pengunjung
import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { catatKirim, masihJeda } from "@/components/kadoea/kirimTamu";
import type { FaqItem } from "@/data/sumitra";
import JaringFaq from "./JaringFaq";

const KUNCI = "sumitra_faq_terakhir";
const inputCls =
  "w-full bg-white border border-slate-300 rounded-xl p-3 text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition";

export default function SumitraFaq({ items }: { items: FaqItem[] }) {
  const [buka, setBuka] = useState<number | null>(0);
  const [nama, setNama] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [website, setWebsite] = useState("");
  const [kirimProses, setKirimProses] = useState(false);
  const [pesan, setPesan] = useState<{ ok: boolean; teks: string } | null>(null);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setPesan(null);
    if (website) return;
    const q = pertanyaan.trim();
    if (q.length < 5) return setPesan({ ok: false, teks: "Pertanyaan terlalu pendek (minimal 5 karakter)." });
    if (masihJeda(KUNCI)) return setPesan({ ok: false, teks: "Tunggu sebentar sebelum mengirim pertanyaan lagi." });
    setKirimProses(true);
    const { error } = await supabase.from("sumitra_faq").insert({
      nama_penanya: nama.trim().slice(0, 80),
      pertanyaan: q.slice(0, 500),
      is_published: false,
    });
    setKirimProses(false);
    if (error) {
      console.error("Gagal mengirim pertanyaan:", error);
      const detail = process.env.NODE_ENV === "development" ? ` (${error.message})` : "";
      return setPesan({ ok: false, teks: `Maaf, pertanyaan gagal dikirim. Coba lagi nanti.${detail}` });
    }
    catatKirim(KUNCI);
    setNama("");
    setPertanyaan("");
    setPesan({ ok: true, teks: "Terima kasih! Pertanyaanmu akan tampil di daftar ini setelah dijawab admin Sumitra." });
  }

  return (
    <section id="faq" className="relative overflow-hidden bg-slate-100 text-slate-900 px-4 sm:px-6 py-20 sm:py-24">
      <JaringFaq />
      <div className="relative max-w-[820px] mx-auto">
        <p className="text-[13px] font-extrabold tracking-[0.08em] text-teal-700">FAQ</p>
        <h2 className="mt-2.5 mb-7 text-3xl sm:text-[40px] leading-tight font-extrabold">Pertanyaan umum</h2>
        <div className="flex flex-col gap-3">
          {items.map((it, i) => {
            const terbuka = buka === i;
            return (
              <div key={it.q} className="bg-white/95 border border-slate-200 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setBuka(terbuka ? null : i)}
                  aria-expanded={terbuka}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 font-extrabold text-base flex justify-between items-center gap-4"
                >
                  {it.q}
                  <ChevronDown className={`w-5 h-5 text-teal-700 shrink-0 transition-transform ${terbuka ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {terbuka && (
                  <p className="px-5 sm:px-6 pb-5 -mt-1 text-[15px] leading-relaxed text-slate-600 whitespace-pre-line">{it.a}</p>
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={kirim} className="mt-7 bg-white/95 border border-teal-200 rounded-2xl p-5 space-y-3">
          <p className="font-extrabold">
            Belum menemukan jawabannya?{" "}
            <span className="font-normal text-slate-600">Kirim pertanyaanmu, jawaban admin akan tampil di daftar di atas.</span>
          </p>
          <div className="grid sm:grid-cols-[200px_1fr] gap-3">
            <input className={inputCls} placeholder="Nama (opsional)" aria-label="Nama (opsional)" maxLength={80}
              value={nama} onChange={(e) => setNama(e.target.value)} />
            <textarea className={inputCls + " resize-none"} rows={2} maxLength={500} placeholder="Tulis pertanyaanmu di sini..."
              aria-label="Pertanyaan" value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} />
          </div>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"
            value={website} onChange={(e) => setWebsite(e.target.value)} />
          {pesan && <p className={`text-sm font-semibold ${pesan.ok ? "text-teal-700" : "text-rose-600"}`} role="status">{pesan.teks}</p>}
          <button type="submit" disabled={kirimProses}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition">
            <Send className="w-4 h-4" aria-hidden /> {kirimProses ? "Mengirim..." : "Kirim Pertanyaan"}
          </button>
        </form>
      </div>
    </section>
  );
}
