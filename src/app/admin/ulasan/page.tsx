"use client";

// src/app/admin/ulasan/page.tsx
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, LogOut, Star, Trash2, Pencil, Plus, Save, X } from "lucide-react";

type Testimonial = {
  id: string;
  author_name: string;
  rating: number;
  body: string;
  profile_url: string | null;
  time_label: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

type FormState = {
  author_name: string;
  rating: number;
  body: string;
  profile_url: string;
  time_label: string;
  is_published: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  author_name: "",
  rating: 5,
  body: "",
  profile_url: "",
  time_label: "",
  is_published: true,
  sort_order: 0,
};

export default function AdminUlasanPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      setMsg({ type: "err", text: "Gagal memuat data: " + error.message });
      return;
    }
    setItems((data ?? []) as Testimonial[]);
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

  function startEdit(t: Testimonial) {
    setEditingId(t.id);
    setForm({
      author_name: t.author_name,
      rating: t.rating,
      body: t.body,
      profile_url: t.profile_url ?? "",
      time_label: t.time_label ?? "",
      is_published: t.is_published,
      sort_order: t.sort_order,
    });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const payload = {
      author_name: form.author_name.trim().slice(0, 80),
      rating: form.rating,
      body: form.body.trim().slice(0, 1500),
      profile_url: form.profile_url.trim() || null,
      time_label: form.time_label.trim().slice(0, 40) || null,
      is_published: form.is_published,
      sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
    };

    if (!payload.author_name || !payload.body) {
      setMsg({ type: "err", text: "Nama penulis dan isi ulasan wajib diisi." });
      return;
    }
    if (payload.profile_url && !/^https?:\/\//i.test(payload.profile_url)) {
      setMsg({ type: "err", text: "Tautan profil harus diawali http:// atau https://" });
      return;
    }

    setSaving(true);
    const { error } = editingId
      ? await supabase.from("testimonials").update(payload).eq("id", editingId)
      : await supabase.from("testimonials").insert(payload);
    setSaving(false);

    if (error) {
      setMsg({ type: "err", text: "Gagal menyimpan: " + error.message });
      return;
    }
    setMsg({ type: "ok", text: editingId ? "Ulasan diperbarui." : "Ulasan ditambahkan." });
    resetForm();
    load();
  }

  async function togglePublish(t: Testimonial) {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_published: !t.is_published })
      .eq("id", t.id);
    if (error) setMsg({ type: "err", text: "Gagal mengubah status: " + error.message });
    else load();
  }

  async function remove(t: Testimonial) {
    if (!confirm(`Hapus ulasan dari "${t.author_name}"?`)) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", t.id);
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

  const inputCls =
    "w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-black text-white">KELOLA ULASAN PUBLIK</h1>
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

        <div className="space-y-8">
          {/* FORM */}
          <form
            onSubmit={save}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-white">
                  {editingId ? "Edit Ulasan" : "Tambah Ulasan"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Salin ulasan apa adanya dari Google Maps. Jangan diubah isinya.
                </p>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Batal edit
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder="Nama penulis (sesuai di Maps)"
                value={form.author_name}
                maxLength={80}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              />
              <select
                className={inputCls}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} bintang
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className={inputCls + " resize-y"}
              rows={4}
              maxLength={1500}
              placeholder="Isi ulasan (tempel apa adanya dari Google Maps)"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder="Tautan profil penulis di Maps (opsional)"
                value={form.profile_url}
                onChange={(e) => setForm({ ...form, profile_url: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder='Waktu, misalnya "2 bulan lalu" (opsional)'
                value={form.time_label}
                maxLength={40}
                onChange={(e) => setForm({ ...form, time_label: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                />
                Tayangkan di beranda
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                Urutan
                <input
                  type="number"
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-sm text-white"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
                <span className="text-xs text-slate-500">(kecil tampil lebih dulu)</span>
              </label>
            </div>

            {msg && (
              <p
                className={`text-xs font-semibold ${
                  msg.type === "ok" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {msg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-xl transition"
            >
              {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Ulasan"}
            </button>
          </form>

          {/* DAFTAR */}
          <div className="space-y-3">
            <h2 className="font-extrabold text-white">Daftar Ulasan ({items.length})</h2>
            {items.length === 0 && <p className="text-sm text-slate-400">Belum ada ulasan.</p>}
            {items.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-start justify-between"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{t.author_name}</span>
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                          }`}
                        />
                      ))}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        t.is_published
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {t.is_published ? "Tayang" : "Disembunyikan"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line break-words">
                    {t.body}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => togglePublish(t)}
                    className="px-3 py-1.5 text-xs font-semibold border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800"
                  >
                    {t.is_published ? "Sembunyikan" : "Tayangkan"}
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4 text-slate-300" />
                  </button>
                  <button
                    onClick={() => remove(t)}
                    className="p-2 border border-red-500/30 rounded-lg hover:bg-red-500/10"
                    aria-label="Hapus"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}