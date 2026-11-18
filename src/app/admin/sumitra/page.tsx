"use client";

// Panel admin Sumitra Kelana Wisata.
// - Admin sekolah & admin Sumitra (Pak Roy): semua menu.
// - Kontributor (siswa): hanya menu Galeri.
// Tampilan dirancang nyaman dipakai dari HP.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, LogOut, Package, Compass, ClipboardList, Camera, Star, HelpCircle, Handshake, Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ambilPeranSaya, LABEL_PERAN, type Peran } from "@/lib/adminPeran";
import PaketPanel from "@/components/admin/sumitra/PaketPanel";
import LayananPanel from "@/components/admin/sumitra/LayananPanel";
import PesananPanel from "@/components/admin/sumitra/PesananPanel";
import GaleriPanel from "@/components/admin/sumitra/GaleriPanel";
import TestimoniPanel from "@/components/admin/sumitra/TestimoniPanel";
import FaqPanel from "@/components/admin/sumitra/FaqPanel";
import MitraPanel from "@/components/admin/sumitra/MitraPanel";
import PengaturanPanel from "@/components/admin/sumitra/PengaturanPanel";

const TABS = [
  { id: "pesanan", label: "Pesanan", icon: ClipboardList },
  { id: "paket", label: "Paket", icon: Package },
  { id: "layanan", label: "Layanan", icon: Compass },
  { id: "galeri", label: "Galeri", icon: Camera },
  { id: "testimoni", label: "Testimoni", icon: Star },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "mitra", label: "Mitra", icon: Handshake },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function AdminSumitraPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [peran, setPeran] = useState<Peran | null>(null);
  const [tab, setTab] = useState<TabId>("pesanan");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace("/admin/login?next=/admin/sumitra");
      const p = await ambilPeranSaya(session.user.id);
      if (!p) {
        await supabase.auth.signOut();
        return router.replace("/admin/login?galat=akses");
      }
      setEmail(session.user.email ?? "");
      setUserId(session.user.id);
      setPeran(p);
      const dariAlamat = new URLSearchParams(window.location.search).get("tab") as TabId | null;
      if (p === "kontributor_sumitra") setTab("galeri");
      else if (dariAlamat && TABS.some((t) => t.id === dariAlamat)) setTab(dariAlamat);
    })();
  }, [router]);

  async function keluar() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (!peran) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-sm font-semibold animate-pulse text-amber-400">Memeriksa Akses Admin...</p>
      </div>
    );
  }

  const isAdmin = peran === "sekolah" || peran === "sumitra";
  const tabTersedia = isAdmin ? TABS : TABS.filter((t) => t.id === "galeri");

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-5 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div className="space-y-1.5 min-w-0">
            {peran === "sekolah" && (
              <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
              </Link>
            )}
            <p className="text-[11px] font-extrabold tracking-[0.08em] text-amber-400">ADMIN SUMITRA</p>
            <h1 className="text-xl sm:text-2xl font-black">Sumitra Kelana Wisata</h1>
            <p className="text-xs text-slate-400 truncate">
              {email} · <span className="text-teal-300 font-bold">{LABEL_PERAN[peran]}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/sumitra" target="_blank" rel="noopener noreferrer"
              className="flex-1 sm:flex-none justify-center border border-slate-700 text-slate-300 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 min-h-11">
              <ExternalLink className="w-4 h-4" /> Lihat Halaman
            </a>
            <button type="button" onClick={keluar}
              className="flex-1 sm:flex-none justify-center bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 min-h-11">
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </header>

        {tabTersedia.length > 1 && (
          <nav aria-label="Menu Sumitra" className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
            <div className="flex gap-1.5 w-max bg-slate-900 border border-slate-800 rounded-2xl p-1.5">
              {tabTersedia.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? "page" : undefined}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition min-h-10 ${
                    tab === t.id ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <t.icon className="w-4 h-4" /> {t.label}
                </button>
              ))}
            </div>
          </nav>
        )}

        <p className="text-xs text-slate-500">Perubahan langsung tampil di halaman /sumitra setelah disimpan (muat ulang halaman untuk melihatnya).</p>

        {tab === "pesanan" && isAdmin && <PesananPanel />}
        {tab === "paket" && isAdmin && <PaketPanel />}
        {tab === "layanan" && isAdmin && <LayananPanel />}
        {tab === "galeri" && <GaleriPanel isAdmin={isAdmin} userId={userId} />}
        {tab === "testimoni" && isAdmin && <TestimoniPanel />}
        {tab === "faq" && isAdmin && <FaqPanel />}
        {tab === "mitra" && isAdmin && <MitraPanel />}
        {tab === "pengaturan" && isAdmin && <PengaturanPanel />}
      </div>
    </div>
  );
}
