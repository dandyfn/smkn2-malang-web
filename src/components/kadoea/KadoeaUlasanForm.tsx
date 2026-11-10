"use client";

// Form pengunjung untuk menulis ulasan. Ulasan masuk ke tabel kadoea_ulasan dengan status
// belum tayang, lalu admin menyetujuinya di /admin/kadoea (tab Ulasan).
import { useState } from "react";
import { Send, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { catatKirim, inputTamuCls, masihJeda } from "./kirimTamu";

const KUNCI = "kadoea_ulasan_terakhir";

export default function KadoeaUlasanForm() {
  const [nama, setNama] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [isi, setIsi] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (website) return; // bot

    const n = nama.trim(), t = isi.trim();
    if (!n) return setMsg({ type: "err", text: "Nama wajib diisi." });
    if (t.length < 5) return setMsg({ type: "err", text: "Ulasan terlalu pendek (minimal 5 karakter)." });
    if (masihJeda(KUNCI)) return setMsg({ type: "err", text: "Tunggu sebentar sebelum mengirim ulasan lagi." });

    setSending(true);
    const { error } = await supabase.from("kadoea_ulasan").insert({
      nama: n.slice(0, 80),
      rating,
      isi: t.slice(0, 1500),
      sumber: "pengunjung",
      is_published: false, // tayang setelah disetujui admin
    });
    setSending(false);

    if (error) {
      console.error("Gagal mengirim ulasan ke Supabase:", error);
      // Saat development (npm run dev), tampilkan pesan asli Supabase supaya mudah dicari penyebabnya
      const detail = process.env.NODE_ENV === "development" ? ` (${error.message})` : "";
      return setMsg({ type: "err", text: `Maaf, ulasan gagal dikirim. Coba lagi nanti.${detail}` });
    }
    catatKirim(KUNCI);
    setNama("");
    setIsi("");
    setRating(5);
    setMsg({ type: "ok", text: "Terima kasih! Ulasanmu akan tampil setelah disetujui admin." });
  }

  return (
    <form onSubmit={kirim} className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-6 shadow-lg space-y-3">
      <div>
        <h3 className="text-lg font-extrabold text-slate-900">Tulis Ulasan</h3>
        <p className="text-sm text-slate-500">Pernah menginap atau menitipkan keluarga di KADOEA? Bagikan pengalamanmu.</p>
      </div>

      {/* Pilih bintang */}
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={`${n} bintang`}
            aria-pressed={rating === n}
            className="p-0.5"
          >
            <Star className={`w-8 h-8 transition ${n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
          </button>
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-600">{rating} dari 5</span>
      </div>

      <input className={inputTamuCls} placeholder="Nama kamu" maxLength={80} value={nama} onChange={(e) => setNama(e.target.value)} />
      <textarea
        className={inputTamuCls + " resize-none"}
        rows={3}
        maxLength={1500}
        placeholder="Ceritakan pengalamanmu..."
        value={isi}
        onChange={(e) => setIsi(e.target.value)}
      />

      {/* Honeypot: tersembunyi dari pengguna, hanya terisi oleh bot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"
        value={website} onChange={(e) => setWebsite(e.target.value)} />

      {msg && (
        <p className={`text-sm font-semibold ${msg.type === "ok" ? "text-emerald-600" : "text-rose-600"}`}>{msg.text}</p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition"
      >
        <Send className="w-4 h-4" /> {sending ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}
