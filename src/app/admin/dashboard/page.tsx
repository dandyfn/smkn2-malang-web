"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LogOut, Newspaper, Trophy, Calendar, Users, Star, HelpCircle } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [loading, setLoading] = useState(true);
  const [pendingFaq, setPendingFaq] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUserEmail(session.user.email ?? "");
        setLoading(false);

        // Hitung pertanyaan FAQ yang belum dijawab (untuk lencana di kartu menu)
        const { count } = await supabase
          .from("faq_questions")
          .select("id", { count: "exact", head: true })
          .is("answer", null);
        setPendingFaq(count ?? 0);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-sm font-semibold animate-pulse text-amber-400">Memeriksa Akses Admin...</p>
      </div>
    );
  }

  const menuItems = [
    { label: "Kelola Berita", desc: "Tambah & edit artikel berita", icon: Newspaper, color: "text-blue-400", href: "/admin/berita" },
    { label: "Kelola Prestasi", desc: "Upload pencapaian siswa", icon: Trophy, color: "text-amber-400", href: "/admin/prestasi" },
    { label: "Kalender Akademik", desc: "Atur jadwal & agenda sekolah", icon: Calendar, color: "text-emerald-400", href: "/admin/kalender" },
    { label: "Daftar Tendik", desc: "Update daftar tendik", icon: Users, color: "text-purple-400", href: "/admin/organisasi" },
    { label: "Kelola Ulasan", desc: "Atur ulasan pilihan dari Google Maps", icon: Star, color: "text-sky-400", href: "/admin/ulasan" },
    { label: "Kelola FAQ", desc: "Jawab pertanyaan dari pengunjung", icon: HelpCircle, color: "text-rose-400", href: "/admin/faq" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 space-y-8">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-white">DASHBOARD ADMIN</h1>
          <p className="text-xs text-slate-400">Login sebagai: <span className="text-amber-400 font-bold">{userEmail}</span></p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      {/* NAVIGASI MENU FITUR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-slate-700 transition-all cursor-pointer group block"
          >
            <div className="flex items-start justify-between">
              <item.icon className={`w-8 h-8 ${item.color} group-hover:scale-110 transition-transform`} />
              {item.href === "/admin/faq" && pendingFaq > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full">
                  {pendingFaq > 99 ? "99+" : pendingFaq} baru
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{item.label}</h3>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}