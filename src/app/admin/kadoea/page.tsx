"use client";

// src/app/admin/kadoea/page.tsx
// Panel admin KADOEA Senior Living: kelola Paket, FAQ, dan Ulasan dalam satu halaman bertab.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, HelpCircle, LogOut, Package, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import PaketPanel from "@/components/admin/kadoea/PaketPanel";
import FaqPanel from "@/components/admin/kadoea/FaqPanel";
import UlasanPanel from "@/components/admin/kadoea/UlasanPanel";

const TABS = [
  { id: "paket", label: "Paket Layanan", icon: Package },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "ulasan", label: "Ulasan", icon: Star },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function AdminKadoeaPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("paket");

  // Cek login admin (pola sama dengan halaman admin lainnya)
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUserEmail(session.user.email ?? "");
        setLoading(false);
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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="space-y-2">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-black text-white">KELOLA KADOEA SENIOR LIVING</h1>
            <p className="text-xs text-slate-400">
              Login sebagai: <span className="text-amber-400 font-bold">{userEmail}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/kadoea" target="_blank" rel="noopener noreferrer"
              className="border border-slate-700 text-slate-300 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition">
              <ExternalLink className="w-4 h-4" /> Lihat Halaman
            </a>
            <button onClick={handleLogout}
              className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>

        {/* TAB */}
        <div className="flex gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                tab === t.id ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 -mt-4">
          Perubahan tampil di halaman /kadoea paling lambat 1 menit setelah disimpan.
        </p>

        {tab === "paket" && <PaketPanel />}
        {tab === "faq" && <FaqPanel />}
        {tab === "ulasan" && <UlasanPanel />}
      </div>
    </div>
  );
}
