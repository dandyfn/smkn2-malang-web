// API "Kelola Akun" (khusus admin sekolah).
// Membuat akun Supabase Auth dan mengatur peran memerlukan SERVICE ROLE KEY, jadi hanya berjalan di server.
// Pasang SUPABASE_SERVICE_ROLE_KEY di .env.local dan di pengaturan hosting (JANGAN diawali NEXT_PUBLIC_).
import { NextResponse, type NextRequest } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const PERAN = ["sekolah", "sumitra", "kontributor_sumitra"] as const;
type Peran = (typeof PERAN)[number];

function adminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function gagal(pesan: string, status = 400) {
  return NextResponse.json({ ok: false, error: pesan }, { status });
}

/** Pastikan pemanggil adalah admin sekolah yang aktif. */
async function periksa(req: NextRequest): Promise<{ db: SupabaseClient; uid: string } | NextResponse> {
  const db = adminClient();
  if (!db) {
    return gagal("SUPABASE_SERVICE_ROLE_KEY belum dipasang di server. Lihat petunjuk pemasangan fitur Kelola Akun.", 500);
  }
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return gagal("Belum login.", 401);
  const { data: u, error } = await db.auth.getUser(token);
  if (error || !u.user) return gagal("Sesi login tidak valid. Silakan login ulang.", 401);
  const { data: r } = await db.from("admin_roles").select("peran, aktif").eq("user_id", u.user.id).maybeSingle();
  if (!r || !r.aktif || r.peran !== "sekolah") return gagal("Hanya admin sekolah yang boleh mengelola akun.", 403);
  return { db, uid: u.user.id };
}

export async function GET(req: NextRequest) {
  const cek = await periksa(req);
  if (cek instanceof NextResponse) return cek;
  const { db } = cek;

  const [{ data: daftar, error }, { data: roles, error: e2 }] = await Promise.all([
    db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    db.from("admin_roles").select("*"),
  ]);
  if (error || e2) return gagal("Gagal memuat akun: " + (error?.message ?? e2?.message), 500);

  const peranPer = new Map((roles ?? []).map((r) => [r.user_id as string, r]));
  const akun = daftar.users.map((u) => {
    const r = peranPer.get(u.id);
    return {
      id: u.id,
      email: u.email ?? "",
      nama: (r?.nama as string) ?? "",
      peran: (r?.peran as Peran) ?? null,
      aktif: r ? Boolean(r.aktif) : false,
      terakhir_login: u.last_sign_in_at ?? null,
      dibuat: u.created_at,
    };
  });
  akun.sort((a, b) => (a.peran ?? "z").localeCompare(b.peran ?? "z") || a.email.localeCompare(b.email));
  return NextResponse.json({ ok: true, data: akun });
}

export async function POST(req: NextRequest) {
  const cek = await periksa(req);
  if (cek instanceof NextResponse) return cek;
  const { db } = cek;

  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const nama = String(body?.nama ?? "").trim().slice(0, 80);
  const peran = body?.peran as Peran;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return gagal("Email tidak valid.");
  if (password.length < 8) return gagal("Kata sandi minimal 8 karakter.");
  if (!PERAN.includes(peran)) return gagal("Peran tidak valid.");

  const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { nama } });
  if (error || !data.user) {
    const sudahAda = /already|registered|exists/i.test(error?.message ?? "");
    return gagal(sudahAda ? "Email ini sudah terdaftar." : "Gagal membuat akun: " + error?.message);
  }
  const { error: e2 } = await db.from("admin_roles").upsert({ user_id: data.user.id, email, nama, peran, aktif: true });
  if (e2) {
    await db.auth.admin.deleteUser(data.user.id);
    return gagal("Gagal menyimpan peran: " + e2.message, 500);
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const cek = await periksa(req);
  if (cek instanceof NextResponse) return cek;
  const { db, uid } = cek;

  const body = await req.json().catch(() => null);
  const userId = String(body?.user_id ?? "");
  const aksi = String(body?.aksi ?? "");
  if (!userId) return gagal("Akun tidak dipilih.");
  if (userId === uid && aksi !== "sandi") return gagal("Tidak bisa mengubah peran atau menonaktifkan akun sendiri.");

  if (aksi === "aktif" || aksi === "nonaktif") {
    const aktif = aksi === "aktif";
    const { data: ada } = await db.from("admin_roles").select("user_id").eq("user_id", userId).maybeSingle();
    if (!ada) return gagal("Pilih peran akun ini terlebih dahulu.");
    const { error } = await db.from("admin_roles").update({ aktif }).eq("user_id", userId);
    if (error) return gagal("Gagal mengubah status: " + error.message, 500);
    // Akun nonaktif juga diblokir dari login
    await db.auth.admin.updateUserById(userId, { ban_duration: aktif ? "none" : "876000h" });
    return NextResponse.json({ ok: true });
  }

  if (aksi === "peran") {
    const peran = body?.peran as Peran;
    if (!PERAN.includes(peran)) return gagal("Peran tidak valid.");
    const { data: ada } = await db.from("admin_roles").select("user_id").eq("user_id", userId).maybeSingle();
    if (ada) {
      const { error } = await db.from("admin_roles").update({ peran }).eq("user_id", userId);
      if (error) return gagal("Gagal mengubah peran: " + error.message, 500);
    } else {
      const { data: u } = await db.auth.admin.getUserById(userId);
      const { error } = await db.from("admin_roles").insert({ user_id: userId, email: u.user?.email ?? null, peran, aktif: true });
      if (error) return gagal("Gagal menyimpan peran: " + error.message, 500);
      await db.auth.admin.updateUserById(userId, { ban_duration: "none" });
    }
    return NextResponse.json({ ok: true });
  }

  if (aksi === "sandi") {
    const password = String(body?.password ?? "");
    if (password.length < 8) return gagal("Kata sandi minimal 8 karakter.");
    const { error } = await db.auth.admin.updateUserById(userId, { password });
    if (error) return gagal("Gagal mengganti kata sandi: " + error.message, 500);
    return NextResponse.json({ ok: true });
  }

  return gagal("Aksi tidak dikenal.");
}
