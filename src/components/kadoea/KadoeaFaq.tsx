"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { FaqItem } from "@/lib/kadoea";
import { catatKirim, masihJeda } from "./kirimTamu";

const KUNCI = "kadoea_faq_terakhir";
const inputCls =
  "w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition";

export default function KadoeaFaq({ items }: { items: FaqItem[] }) {
  // Pertanyaan pertama terbuka secara default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Form pertanyaan pengunjung
  const [nama, setNama] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (website) return; // bot

    const q = pertanyaan.trim();
    if (q.length < 5) return setMsg({ type: "err", text: "Pertanyaan terlalu pendek (minimal 5 karakter)." });
    if (masihJeda(KUNCI)) return setMsg({ type: "err", text: "Tunggu sebentar sebelum mengirim pertanyaan lagi." });

    setSending(true);
    const { error } = await supabase.from("kadoea_faq").insert({
      // string kosong (bukan null) menandai pertanyaan dari pengunjung yang tidak mengisi nama
      nama_penanya: nama.trim().slice(0, 80),
      pertanyaan: q.slice(0, 500),
      is_published: false, // tayang setelah dijawab admin
    });
    setSending(false);

    if (error) {
      console.error("Gagal mengirim pertanyaan ke Supabase:", error);
      // Saat development (npm run dev), tampilkan pesan asli Supabase supaya mudah dicari penyebabnya
      const detail = process.env.NODE_ENV === "development" ? ` (${error.message})` : "";
      return setMsg({ type: "err", text: `Maaf, pertanyaan gagal dikirim. Coba lagi nanti.${detail}` });
    }
    catatKirim(KUNCI);
    setNama("");
    setPertanyaan("");
    setMsg({ type: "ok", text: "Terima kasih! Pertanyaanmu akan tampil di daftar ini setelah dijawab admin." });
  }

  return (
    <section
      id="faq"
      className="relative px-6 py-24 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bgpusatinfo.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-950/90" />
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-amber-400" />
            <h2 className="text-3xl sm:text-4xl font-black text-white">Pertanyaan Umum</h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Hal yang paling sering ditanyakan keluarga sebelum menitipkan orang tuanya.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.q}
                className="bg-slate-950/80 border border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl"
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="w-full text-left px-5 py-4 font-bold text-white text-base sm:text-lg flex justify-between items-center gap-4 hover:text-amber-400 transition"
                >
                  {item.q}
                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <p className="px-5 pb-5 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800 pt-4 whitespace-pre-line">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Form kirim pertanyaan */}
        <form
          onSubmit={kirim}
          className="mt-8 bg-slate-950/80 border border-amber-400/30 rounded-2xl p-5 space-y-3 backdrop-blur-md shadow-2xl"
        >
          <p className="text-sm sm:text-base font-bold text-white">
            Belum menemukan jawabannya?{" "}
            <span className="font-normal text-slate-300">Kirim pertanyaanmu, jawaban admin akan tampil di daftar di atas.</span>
          </p>
          <div className="grid sm:grid-cols-[200px_1fr] gap-3">
            <input className={inputCls} placeholder="Nama (opsional)" maxLength={80} value={nama} onChange={(e) => setNama(e.target.value)} />
            <textarea
              className={inputCls + " resize-none"}
              rows={2}
              maxLength={500}
              placeholder="Tulis pertanyaanmu di sini..."
              value={pertanyaan}
              onChange={(e) => setPertanyaan(e.target.value)}
            />
          </div>

          {/* Honeypot: tersembunyi dari pengguna, hanya terisi oleh bot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"
            value={website} onChange={(e) => setWebsite(e.target.value)} />

          {msg && (
            <p className={`text-sm font-semibold ${msg.type === "ok" ? "text-emerald-400" : "text-rose-400"}`}>{msg.text}</p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl transition"
          >
            <Send className="w-4 h-4" /> {sending ? "Mengirim..." : "Kirim Pertanyaan"}
          </button>
        </form>
      </div>
    </section>
  );
}
