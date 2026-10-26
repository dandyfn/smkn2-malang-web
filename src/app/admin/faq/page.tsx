"use client";

// src/app/admin/faq/page.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, LogOut, Trash2, Send, Eye, EyeOff } from "lucide-react";

type Question = {
  id: string;
  asker_name: string | null;
  question: string;
  answer: string | null;
  is_published: boolean;
  answered_at: string | null;
  created_at: string;
};

type Filter = "menunggu" | "dijawab" | "semua";

export default function AdminFaqPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Question[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Filter>("menunggu");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("faq_questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setMsg({ type: "err", text: "Gagal memuat data: " + error.message });
      return;
    }
    const rows = (data ?? []) as Question[];
    setItems(rows);
    setDrafts((prev) => {
      const next = { ...prev };
      rows.forEach((r) => {
        if (next[r.id] === undefined) next[r.id] = r.answer ?? "";
      });
      return next;
    });
  }, []);

  // Cek login admin (pola sama dengan halaman dashboard)
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUserEmail(session.user.email ?? "");
        setLoading(false);
        load();
      }
    };
    checkAuth();
  }, [router, load]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const pendingCount = useMemo(() => items.filter((i) => !i.answer).length, [items]);

  const visible = useMemo(() => {
    if (filter === "menunggu") return items.filter((i) => !i.answer);
    if (filter === "dijawab") return items.filter((i) => !!i.answer);
    return items;
  }, [items, filter]);

  async function sendAnswer(q: Question) {
    setMsg(null);
    const text = (drafts[q.id] ?? "").trim().slice(0, 2000);
    if (!text) {
      setMsg({ type: "err", text: "Isi jawaban dulu sebelum mengirim." });
      return;
    }
    setSavingId(q.id);
    const { error } = await supabase
      .from("faq_questions")
      .update({
        answer: text,
        is_published: true, // langsung tayang di FAQ; bisa disembunyikan lagi
        answered_at: new Date().toISOString(),
      })
      .eq("id", q.id);
    setSavingId(null);
    if (error) {
      setMsg({ type: "err", text: "Gagal menyimpan jawaban: " + error.message });
      return;
    }
    setMsg({ type: "ok", text: "Jawaban disimpan dan ditayangkan di FAQ." });
    load();
  }

  async function togglePublish(q: Question) {
    const { error } = await supabase
      .from("faq_questions")
      .update({ is_published: !q.is_published })
      .eq("id", q.id);
    if (error) setMsg({ type: "err", text: "Gagal mengubah status: " + error.message });
    else load();
  }

  async function remove(q: Question) {
    if (!confirm("Hapus pertanyaan ini secara permanen?")) return;
    const { error } = await supabase.from("faq_questions").delete().eq("id", q.id);
    if (error) setMsg({ type: "err", text: "Gagal menghapus: " + error.message });
    else load();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-sm font-semibold animate-pulse text-amber-400">Memeriksa Akses Admin...</p>
      </div>
    );
  }

  const tabCls = (active: boolean) =>
    `px-4 py-2 rounded-xl text-xs font-bold border transition ${
      active
        ? "bg-amber-500 text-slate-950 border-amber-500"
        : "border-slate-700 text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-black text-white">KELOLA PERTANYAAN FAQ</h1>
          <p className="text-xs text-slate-400">
            Login sebagai: <span className="text-amber-400 font-bold">{userEmail}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <div className="max-w-4xl space-y-5">
        {/* FILTER */}
        <div className="flex flex-wrap gap-2">
          <button className={tabCls(filter === "menunggu")} onClick={() => setFilter("menunggu")}>
            Menunggu dijawab ({pendingCount})
          </button>
          <button className={tabCls(filter === "dijawab")} onClick={() => setFilter("dijawab")}>
            Sudah dijawab ({items.length - pendingCount})
          </button>
          <button className={tabCls(filter === "semua")} onClick={() => setFilter("semua")}>
            Semua ({items.length})
          </button>
        </div>

        {msg && (
          <p className={`text-xs font-semibold ${msg.type === "ok" ? "text-emerald-400" : "text-rose-400"}`}>
            {msg.text}
          </p>
        )}

        {/* DAFTAR */}
        <div className="space-y-3">
          {visible.length === 0 && (
            <p className="text-sm text-slate-400">
              {filter === "menunggu" ? "Tidak ada pertanyaan yang menunggu jawaban." : "Belum ada data."}
            </p>
          )}

          {visible.map((q) => {
            const answered = !!q.answer;
            const changed = (drafts[q.id] ?? "") !== (q.answer ?? "");
            return (
              <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
                    <span className="font-bold text-sm text-white">{q.asker_name || "Anonim"}</span>
                    <span>
                      {new Date(q.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        !answered
                          ? "bg-amber-500/15 text-amber-400"
                          : q.is_published
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {!answered ? "Menunggu" : q.is_published ? "Tayang" : "Disembunyikan"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {answered && (
                      <button
                        onClick={() => togglePublish(q)}
                        className="px-3 py-1.5 text-xs font-semibold border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 inline-flex items-center gap-1.5"
                      >
                        {q.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {q.is_published ? "Sembunyikan" : "Tayangkan"}
                      </button>
                    )}
                    <button
                      onClick={() => remove(q)}
                      className="p-2 border border-red-500/30 rounded-lg hover:bg-red-500/10"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-100 whitespace-pre-line break-words font-semibold">
                  {q.question}
                </p>

                <textarea
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition resize-y"
                  rows={3}
                  maxLength={2000}
                  placeholder="Tulis jawaban untuk pertanyaan ini..."
                  value={drafts[q.id] ?? ""}
                  onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })}
                />

                <button
                  onClick={() => sendAnswer(q)}
                  disabled={savingId === q.id || (answered && !changed)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                  {savingId === q.id ? "Menyimpan..." : answered ? "Perbarui Jawaban" : "Kirim Jawaban"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}