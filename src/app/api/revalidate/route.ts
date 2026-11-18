// Menyegarkan halaman publik segera setelah admin menyimpan perubahan.
// Tanpa ini, halaman /sumitra dan /kadoea baru memperbarui diri tiap 60 detik
// dan baru terlihat setelah ada pengunjung berikutnya (bisa terasa beberapa menit).
import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Halaman yang boleh disegarkan, beserta peran yang berhak
const HALAMAN: Record<string, { peran: string[]; jalur: { path: string; jenis?: "page" | "layout" }[] }> = {
  sumitra: {
    peran: ["sekolah", "sumitra", "kontributor_sumitra"],
    jalur: [{ path: "/sumitra" }, { path: "/sumitra/dokumentasi" }, { path: "/sumitra/paket/[slug]", jenis: "page" }],
  },
  kadoea: { peran: ["sekolah"], jalur: [{ path: "/kadoea" }] },
};

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const body = await req.json().catch(() => null);
  const target = HALAMAN[String(body?.halaman ?? "")];
  if (!token) return NextResponse.json({ ok: false, error: "Belum login." }, { status: 401 });
  if (!target) return NextResponse.json({ ok: false, error: "Halaman tidak dikenal." }, { status: 400 });

  // Periksa login & peran memakai token admin itu sendiri (RLS: hanya bisa membaca peran sendiri)
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: u, error } = await db.auth.getUser(token);
  if (error || !u.user) return NextResponse.json({ ok: false, error: "Sesi tidak valid." }, { status: 401 });

  const { data: r, error: e2 } = await db.from("admin_roles").select("peran, aktif").eq("user_id", u.user.id).maybeSingle();
  // Tabel peran belum dibuat = semua admin dianggap admin sekolah (sama seperti di panel admin)
  const tabelBelumAda = !!e2 && (e2.code === "42P01" || e2.code === "PGRST205" || /Could not find the table|does not exist/.test(e2.message));
  const peran = tabelBelumAda ? "sekolah" : r?.aktif ? r.peran : null;
  if (!peran || !target.peran.includes(peran)) {
    return NextResponse.json({ ok: false, error: "Tidak berhak." }, { status: 403 });
  }

  for (const j of target.jalur) revalidatePath(j.path, j.jenis);
  return NextResponse.json({ ok: true });
}
