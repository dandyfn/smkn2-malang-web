"use client";

// Penjaga akses semua halaman /admin berdasarkan peran akun.
// Akun Sumitra yang membuka menu sekolah (mis. /admin/berita) diarahkan ke panel Sumitra.
// Keamanan sebenarnya tetap dijaga di database (RLS); ini hanya agar tampilan sesuai peran.
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ambilPeranSaya, bolehBuka, halamanAwal } from "@/lib/adminPeran";

export default function AdminGuard() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!path || path === "/admin/login") return;
    let batal = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || batal) return; // halaman masing-masing sudah mengarahkan ke login
      const peran = await ambilPeranSaya(session.user.id);
      if (batal) return;
      if (!peran) {
        await supabase.auth.signOut();
        router.replace("/admin/login?galat=akses");
        return;
      }
      if (!bolehBuka(peran, path)) router.replace(halamanAwal(peran));
    })();
    return () => {
      batal = true;
    };
  }, [path, router]);

  return null;
}
