import { redirect } from "next/navigation";

// Alamat pendek untuk Pak Roy dan siswa: smkn2malang.sch.id/sumitra/admin
// Diarahkan ke halaman login, lalu langsung ke panel Sumitra.
export default function SumitraAdminShortcut() {
  redirect("/admin/login?next=/admin/sumitra");
}
