"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, HelpCircle, Send } from "lucide-react";
import Testimoni from "@/components/Testimoni";
import { supabase } from "@/lib/supabase";

type FaqItem = { q: string; a: string };

const FAQ_STATIS: FaqItem[] = [
  {
    q: "Kapan pendaftaran PPDB SMKN 2 Malang dibuka?",
    a: "Pendaftaran PPDB biasanya dibuka sesuai dengan jadwal resmi Dinas Pendidikan Jawa Timur sekitar bulan Mei–Juni setiap tahunnya.",
  },
  {
    q: "Apa saja konsentrasi keahlian yang ada di SMKN 2 Malang?",
    a: "Terdapat 6 konsentrasi keahlian: Perhotelan, Kuliner, Pekerjaan Sosial (PKS), Keperawatan & Caregiver, Usaha Layanan Wisata (ULW), serta Teknik Komputer & Jaringan (TKJ).",
  },
  {
    q: "Bagaimana cara kerja Bursa Kerja Khusus (BKK)?",
    a: "BKK SMKN 2 Malang memfasilitasi rekruitmen langsung dari perusahaan mitra DUDI untuk alumni dan siswa tingkat akhir.",
  },
];

const COOLDOWN_MS = 60_000;
const LAST_SENT_KEY = "faq_last_sent";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [progress, setProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // FAQ dari admin (pertanyaan pengunjung yang sudah dijawab)
  const [dynamicFaqs, setDynamicFaqs] = useState<FaqItem[]>([]);

  // Form pertanyaan
  const [nama, setNama] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: harus tetap kosong
  const [sending, setSending] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDistance = rect.height - windowHeight;

      if (totalDistance <= 0) return;

      const currentPosition = -rect.top;
      let p = currentPosition / totalDistance;
      p = Math.max(0, Math.min(1, p));

      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadAnswered = async () => {
      const { data, error } = await supabase
        .from("faq_questions")
        .select("question, answer")
        .eq("is_published", true)
        .not("answer", "is", null)
        .order("answered_at", { ascending: false })
        .limit(20);
      if (!error && data) {
        setDynamicFaqs(
          data.map((d) => ({ q: d.question as string, a: d.answer as string }))
        );
      }
    };
    loadAnswered();
  }, []);

  async function kirimPertanyaan(e: React.FormEvent) {
    e.preventDefault();
    setFormMsg(null);

    // Honeypot: bot biasanya mengisi kolom tersembunyi ini
    if (website) return;

    const q = pertanyaan.trim();
    if (q.length < 5) {
      setFormMsg({ type: "err", text: "Pertanyaan terlalu pendek (minimal 5 karakter)." });
      return;
    }

    // Jeda antar kirim (pembatas ringan di sisi browser)
    try {
      const last = Number(localStorage.getItem(LAST_SENT_KEY) ?? 0);
      if (Date.now() - last < COOLDOWN_MS) {
        setFormMsg({ type: "err", text: "Tunggu sebentar sebelum mengirim pertanyaan lagi." });
        return;
      }
    } catch {
      /* localStorage tidak tersedia, abaikan */
    }

    setSending(true);
    const { error } = await supabase.from("faq_questions").insert({
      asker_name: nama.trim().slice(0, 80) || null,
      question: q.slice(0, 500),
    });
    setSending(false);

    if (error) {
      setFormMsg({ type: "err", text: "Pertanyaan gagal dikirim. Silakan coba lagi nanti." });
      return;
    }

    try {
      localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
    } catch {
      /* abaikan */
    }
    setNama("");
    setPertanyaan("");
    setFormMsg({
      type: "ok",
      text: "Pertanyaan terkirim. Jawaban dari admin akan tampil di daftar FAQ ini.",
    });
  }

  const faqs: FaqItem[] = [...FAQ_STATIS, ...dynamicFaqs];

  const translateX = (1 - progress) * 100;

  const inputCls =
    "w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition";

  return (
    <div ref={trackRef} className="relative h-[250vh] w-full bg-slate-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden z-30">
        
        {/* Layer 1: Testimoni */}
        <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
          <Testimoni />
        </div>

        {/* Layer 2: Pusat Informasi FAQ */}
        <section
          style={{
            transform: `translate3d(${translateX}%, 0px, 0px)`,
            willChange: "transform",
          }}
          className="absolute inset-0 w-full h-full text-white px-6 flex flex-col justify-center z-20 shadow-[-30px_0_60px_rgba(0,0,0,0.95)] overflow-hidden"
        >
          {/* GAMBAR BACKGROUND */}
          <img
            src="/images/bgpusatinfo.jpg"
            alt="Background Pusat Informasi"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* OVERLAY DENGAN KEGELAPAN DITURUNKAN (Sangat terang dan gambar terlihat jelas) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60 backdrop-blur-[2px] z-0" />

          {/* KONTEN FAQ: judul tetap di atas, daftar FAQ yang di-scroll, form tetap di bawah.
              pt-28/32 memberi ruang agar judul tidak tertutup navbar. */}
          <div className="max-w-4xl mx-auto w-full relative z-10 h-full min-h-0 flex flex-col gap-4 pt-28 sm:pt-32 pb-6">
            {/* JUDUL */}
            <div className="shrink-0 text-center drop-shadow-md">
              <div className="flex items-center justify-center gap-3">
                <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 drop-shadow" />
                <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                  Pusat Informasi & FAQ
                </h3>
              </div>
              <p className="text-slate-200 text-xs sm:text-sm mt-1.5 font-medium drop-shadow">
                Pertanyaan yang paling sering ditanyakan seputar SMKN 2 Malang
              </p>
            </div>

            {/* DAFTAR FAQ (hanya bagian ini yang di-scroll) */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2.5 pr-1 [scrollbar-width:thin]">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-slate-950/80 border border-slate-700/60 rounded-2xl overflow-hidden transition backdrop-blur-md shadow-2xl"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full text-left px-5 py-3.5 font-bold text-white text-sm sm:text-base flex justify-between items-center gap-4 hover:text-amber-400 transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-slate-800/80 pt-3 whitespace-pre-line">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FORM TANYA ADMIN (ringkas, selalu terlihat di bawah) */}
            <form
              onSubmit={kirimPertanyaan}
              className="shrink-0 bg-slate-950/80 border border-slate-700/60 rounded-2xl p-4 space-y-2.5 backdrop-blur-md shadow-2xl"
            >
              <p className="text-xs sm:text-sm font-bold text-white">
                Belum menemukan jawabannya?{" "}
                <span className="font-normal text-slate-300">
                  Kirim pertanyaanmu, jawaban admin akan tampil di daftar di atas.
                </span>
              </p>

              <div className="grid sm:grid-cols-[180px_1fr_auto] gap-2">
                <input
                  className={inputCls}
                  placeholder="Nama (opsional)"
                  maxLength={80}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
                <textarea
                  className={inputCls + " resize-none"}
                  rows={2}
                  maxLength={500}
                  placeholder="Tulis pertanyaanmu di sini..."
                  value={pertanyaan}
                  onChange={(e) => setPertanyaan(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Mengirim..." : "Kirim"}
                </button>
              </div>

              {/* Honeypot: disembunyikan dari pengguna, hanya terisi oleh bot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />

              {formMsg && (
                <p className={`text-xs font-semibold ${formMsg.type === "ok" ? "text-emerald-400" : "text-rose-400"}`}>
                  {formMsg.text}
                </p>
              )}
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}