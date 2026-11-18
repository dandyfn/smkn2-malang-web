// Dipanggil panel admin setelah menyimpan, agar perubahan langsung tampil di halaman publik.
import { supabase } from "@/lib/supabase";

export async function segarkanHalaman(halaman: "sumitra" | "kadoea") {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ halaman }),
    });
  } catch {
    // Gagal menyegarkan tidak menggagalkan penyimpanan; halaman tetap diperbarui otomatis tiap 60 detik.
  }
}
