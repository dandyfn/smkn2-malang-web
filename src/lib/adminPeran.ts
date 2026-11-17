// Peran akun admin (tabel admin_roles, lihat supabase/sumitra.sql).
//   sekolah             -> semua menu admin
//   sumitra             -> hanya panel Sumitra
//   kontributor_sumitra -> hanya unggah galeri Sumitra
import { supabase } from "@/lib/supabase";

export type Peran = "sekolah" | "sumitra" | "kontributor_sumitra";

export const LABEL_PERAN: Record<Peran, string> = {
  sekolah: "Admin Sekolah",
  sumitra: "Admin Sumitra",
  kontributor_sumitra: "Kontributor Sumitra",
};

/**
 * Peran akun yang sedang login.
 * - null: akun tidak punya peran atau dinonaktifkan.
 * - Jika tabel peran belum dibuat (SQL Sumitra belum dijalankan), semua akun dianggap admin sekolah
 *   seperti sebelum fitur peran ada, supaya admin lama tidak terkunci.
 */
export async function ambilPeranSaya(userId: string): Promise<Peran | null> {
  const { data, error } = await supabase.from("admin_roles").select("peran, aktif").eq("user_id", userId).maybeSingle();
  if (error) {
    const tabelBelumAda =
      error.code === "42P01" || error.code === "PGRST205" || /Could not find the table|does not exist/.test(error.message);
    return tabelBelumAda ? "sekolah" : null;
  }
  if (!data || !data.aktif) return null;
  return data.peran as Peran;
}

/** Halaman awal setelah login sesuai peran. */
export function halamanAwal(peran: Peran): string {
  if (peran === "sekolah") return "/admin/dashboard";
  if (peran === "kontributor_sumitra") return "/admin/sumitra?tab=galeri";
  return "/admin/sumitra";
}

/** Apakah peran boleh membuka alamat admin tertentu. */
export function bolehBuka(peran: Peran, path: string): boolean {
  if (peran === "sekolah") return true;
  return path === "/admin/sumitra" || path.startsWith("/admin/sumitra/") || path === "/admin/login";
}
