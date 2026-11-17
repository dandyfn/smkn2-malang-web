"use client";

// Kelola Akun (khusus admin sekolah): buat akun admin Sumitra / siswa kontributor,
// ubah peran, nonaktifkan akun siswa yang sudah selesai, dan ganti kata sandi.
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, KeyRound, Power, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ambilPeranSaya, LABEL_PERAN, type Peran } from "@/lib/adminPeran";
import { inputCls, Pesan, type Msg } from "@/components/admin/kadoea/ui";

type Akun = {
  id: string; email: string; nama: string; peran: Peran | null; aktif: boolean; terakhir_login: string | null; dibuat: string;
};

const PERAN_PILIHAN: { id: Peran; label: string; ket: string }[] = [
  { id: "sumitra", label: "Admin Sumitra", ket: "Mengelola semua menu Sumitra (untuk Pak Roy)" },
  { id: "kontributor_sumitra", label: "Kontributor Sumitra", ket: "Hanya mengunggah galeri perjalanan (untuk siswa)" },
  { id: "sekolah", label: "Admin Sekolah", ket: "Semua menu admin, termasuk Kelola Akun" },
];

async function panggil(metode: "GET" | "POST" | "PATCH", body?: unknown) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch("/api/admin/akun", {
    method: metode,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token ?? ""}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({ ok: false, error: "Server tidak merespons dengan benar." }));
  return json as { ok: boolean; error?: string; data?: Akun[] };
}

export default function KelolaAkunPage() {
  const router = useRouter();
  const [siap, setSiap] = useState(false);
  const [saya, setSaya] = useState("");
  const [akun, setAkun] = useState<Akun[]>([]);
  const [msg, setMsg] = useState<Msg>(null);
  const [form, setForm] = useState({ nama: "", email: "", password: "", peran: "kontributor_sumitra" as Peran });
  const [proses, setProses] = useState(false);

  const muat = useCallback(async () => {
    const r = await panggil("GET");
    if (!r.ok) setMsg({ type: "err", text: r.error ?? "Gagal memuat akun." });
    else setAkun(r.data ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace("/admin/login");
      const peran = await ambilPeranSaya(session.user.id);
      if (peran !== "sekolah") return router.replace("/admin/dashboard");
      setSaya(session.user.id);
      setSiap(true);
      muat();
    })();
  }, [router, muat]);

  async function buat(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setProses(true);
    const r = await panggil("POST", form);
    setProses(false);
    if (!r.ok) return setMsg({ type: "err", text: r.error ?? "Gagal membuat akun." });
    setMsg({ type: "ok", text: `Akun ${form.email} dibuat. Berikan email dan kata sandi awal kepada pemiliknya.` });
    setForm({ nama: "", email: "", password: "", peran: form.peran });
    muat();
  }

  async function ubah(a: Akun, body: Record<string, unknown>, ok: string) {
    setMsg(null);
    const r = await panggil("PATCH", { user_id: a.id, ...body });
    if (!r.ok) return setMsg({ type: "err", text: r.error ?? "Gagal menyimpan." });
    setMsg({ type: "ok", text: ok });
    muat();
  }

  function gantiSandi(a: Akun) {
    const baru = prompt(`Kata sandi baru untuk ${a.email} (minimal 8 karakter):`);
    if (baru) ubah(a, { aksi: "sandi", password: baru }, `Kata sandi ${a.email} diganti.`);
  }

  if (!siap) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-sm font-semibold animate-pulse text-amber-400">Memeriksa Akses Admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-5 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-1.5">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-black">KELOLA AKUN</h1>
          <p className="text-xs text-slate-400">
            Akun admin Sumitra dan siswa kontributor login di <span className="text-amber-400 font-bold">/admin/login</span> atau alamat pendek{" "}
            <span className="text-amber-400 font-bold">/sumitra/admin</span>.
          </p>
        </header>

        <form onSubmit={buat} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="font-extrabold flex items-center gap-2"><UserPlus className="w-5 h-5 text-amber-400" /> Buat Akun Baru</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-xs font-bold text-slate-300 space-y-1.5 block">Nama
              <input className={inputCls} value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} maxLength={80} placeholder="Nama pemilik akun" />
            </label>
            <label className="text-xs font-bold text-slate-300 space-y-1.5 block">Email
              <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
          </div>
          <label className="text-xs font-bold text-slate-300 space-y-1.5 block">Kata sandi awal (minimal 8 karakter)
            <input type="text" className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required autoComplete="new-password" />
          </label>
          <fieldset className="space-y-2">
            <legend className="text-xs font-bold text-slate-300 mb-1.5">Peran</legend>
            {PERAN_PILIHAN.map((p) => (
              <label key={p.id} className={`flex gap-3 items-start rounded-xl border p-3 cursor-pointer ${form.peran === p.id ? "border-amber-400 bg-amber-500/5" : "border-slate-700"}`}>
                <input type="radio" name="peran" checked={form.peran === p.id} onChange={() => setForm({ ...form, peran: p.id })} className="mt-1" />
                <span>
                  <span className="block text-sm font-bold">{p.label}</span>
                  <span className="block text-xs text-slate-400">{p.ket}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <Pesan msg={msg} />
          <button type="submit" disabled={proses}
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold text-sm rounded-xl">
            <UserPlus className="w-4 h-4" /> {proses ? "Membuat akun..." : "Buat Akun"}
          </button>
        </form>

        <section className="space-y-3">
          <h2 className="font-extrabold">Daftar Akun ({akun.length})</h2>
          {akun.map((a) => {
            const diriSendiri = a.id === saya;
            return (
              <article key={a.id} className={`bg-slate-900 border rounded-2xl p-4 space-y-3 ${a.aktif ? "border-slate-800" : "border-slate-800 opacity-70"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm">{a.nama || a.email}</span>
                  {a.nama && <span className="text-xs text-slate-400">{a.email}</span>}
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${a.aktif ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                    {a.peran ? (a.aktif ? "Aktif" : "Nonaktif") : "Belum punya peran"}
                  </span>
                  {diriSendiri && <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400">Akun Anda</span>}
                </div>
                <p className="text-[11px] text-slate-500">
                  Login terakhir: {a.terakhir_login ? new Date(a.terakhir_login).toLocaleString("id-ID") : "belum pernah"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <select
                    aria-label={`Peran ${a.email}`}
                    disabled={diriSendiri}
                    value={a.peran ?? ""}
                    onChange={(e) => ubah(a, { aksi: "peran", peran: e.target.value }, `Peran ${a.email} diubah.`)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold disabled:opacity-50 min-h-11"
                  >
                    {!a.peran && <option value="">Pilih peran...</option>}
                    {PERAN_PILIHAN.map((p) => <option key={p.id} value={p.id}>{LABEL_PERAN[p.id]}</option>)}
                  </select>
                  {a.peran && !diriSendiri && (
                    <button type="button"
                      onClick={() => ubah(a, { aksi: a.aktif ? "nonaktif" : "aktif" }, `Akun ${a.email} ${a.aktif ? "dinonaktifkan" : "diaktifkan"}.`)}
                      className={`inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border min-h-11 ${
                        a.aktif ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      }`}>
                      <Power className="w-4 h-4" /> {a.aktif ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  )}
                  <button type="button" onClick={() => gantiSandi(a)}
                    className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 min-h-11">
                    <KeyRound className="w-4 h-4" /> Ganti kata sandi
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
