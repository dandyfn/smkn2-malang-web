"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, Calendar as CalendarIcon, Search, 
  Edit3, Trash2, X, Save, Sparkles, Clock, Loader2 
} from "lucide-react";
import Link from "next/link";

interface EventAkademik {
  id: string;
  judul: string;
  tanggal: string; // YYYY-MM-DD
  tanggal_selesai: string; // YYYY-MM-DD
  kategori: "Ujian" | "Kegiatan" | "Libur" | "Pengumuman";
  jam_mulai?: string;
  jam_selesai?: string;
  deskripsi?: string;
  created_at?: string;
}

// Generator Waktu Interval 30 Menit (00:00 s.d 23:30)
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    TIME_OPTIONS.push(`${hh}:${mm}`);
  }
}

export default function AdminKalenderPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventAkademik[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [kategori, setKategori] = useState<EventAkademik["kategori"]>("Kegiatan");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("kalender")
      .select("*")
      .order("tanggal", { ascending: true });
    if (data) setEvents(data);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else fetchEvents();
    };
    checkAuth();
  }, [router]);

  const resetForm = () => {
    setEditingId(null);
    setJudul("");
    setTanggal("");
    setTanggalSelesai("");
    setKategori("Kegiatan");
    setJamMulai("");
    setJamSelesai("");
    setDeskripsi("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !tanggal) return alert("Judul dan Tanggal Mulai wajib diisi!");

    setLoading(true);

    const payload = {
      judul,
      tanggal,
      tanggal_selesai: tanggalSelesai || tanggal,
      kategori,
      jam_mulai: jamMulai || null,
      jam_selesai: jamSelesai || null,
      deskripsi,
    };

    if (editingId) {
      const { error } = await supabase
        .from("kalender")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert("Gagal memperbarui agenda: " + error.message);
      } else {
        alert("Agenda berhasil diperbarui!");
        resetForm();
        fetchEvents();
      }
    } else {
      const { error } = await supabase.from("kalender").insert([payload]);

      if (error) {
        alert("Gagal menambahkan agenda: " + error.message);
      } else {
        alert("Agenda berhasil ditambahkan!");
        resetForm();
        fetchEvents();
      }
    }

    setLoading(false);
  };

  const handleEditClick = (item: EventAkademik) => {
    setEditingId(item.id);
    setJudul(item.judul);
    setTanggal(item.tanggal);
    setTanggalSelesai(item.tanggal_selesai || item.tanggal);
    setKategori(item.kategori);
    setJamMulai(item.jam_mulai || "");
    setJamSelesai(item.jam_selesai || "");
    setDeskripsi(item.deskripsi || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus agenda ini?")) return;
    await supabase.from("kalender").delete().eq("id", id);
    if (editingId === id) resetForm();
    fetchEvents();
  };

  const getBadgeStyle = (kat: string) => {
    switch (kat) {
      case "Ujian":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Kegiatan":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Libur":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.tanggal.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header Admin */}
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <Link
          href="/admin/dashboard"
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-white">
            <CalendarIcon className="w-5 h-5 text-amber-400" /> Kelola Kalender Akademik
          </h1>
          <p className="text-xs text-slate-400">Tambah dan kelola jadwal ujian, kegiatan, dan libur sekolah</p>
        </div>
      </div>

      {/* Form Tambah/Edit Agenda */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 
            {editingId ? "Edit Agenda" : "Form Tambah Agenda"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" /> Batal Edit
            </button>
          )}
        </div>

        {/* Row 1: Nama Agenda & Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Nama Agenda / Kegiatan *</label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Kategori *</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value as EventAkademik["kategori"])}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white cursor-pointer"
            >
              <option value="Ujian">Ujian</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Libur">Libur</option>
              <option value="Pengumuman">Pengumuman</option>
            </select>
          </div>
        </div>

        {/* Row 2: Tanggal Mulai & Tanggal Selesai */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Tanggal Mulai *</label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={(e) => {
                setTanggal(e.target.value);
                if (!tanggalSelesai || e.target.value > tanggalSelesai) {
                  setTanggalSelesai(e.target.value);
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Tanggal Selesai (Kosongkan jika 1 hari)</label>
            <input
              type="date"
              min={tanggal}
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>
        </div>

        {/* Row 3: Jam Mulai & Jam Selesai (Opsional Style Google Calendar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Jam Mulai (Opsional)</label>
            <select
              value={jamMulai}
              onChange={(e) => setJamMulai(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white cursor-pointer"
            >
              <option value="">-- Tanpa Jam / Seharian --</option>
              {TIME_OPTIONS.map((t) => (
                <option key={`m-${t}`} value={t}>{t} WIB</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Jam Selesai (Opsional)</label>
            <select
              value={jamSelesai}
              onChange={(e) => setJamSelesai(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white cursor-pointer"
            >
              <option value="">-- Tanpa Jam --</option>
              {TIME_OPTIONS.map((t) => (
                <option key={`s-${t}`} value={t}>{t} WIB</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Deskripsi */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Deskripsi Ringkas</label>
          <textarea
            rows={3}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
          />
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Menyimpan..." : editingId ? "Perbarui Agenda" : "Simpan Agenda"}
          </button>
        </div>
      </form>

      {/* List Data Agenda */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-400">Daftar Agenda Terjadwal</h2>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 text-white"
            />
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <p className="text-xs text-slate-600 italic">Belum ada agenda ditemukan.</p>
        ) : (
          <div className="grid gap-3">
            {filteredEvents.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-amber-400 font-bold">
                      {item.tanggal} {item.tanggal_selesai && item.tanggal_selesai !== item.tanggal ? `s.d ${item.tanggal_selesai}` : ""}
                    </span>
                    <span className={`text-[10px] border px-2 py-0.5 rounded-md font-bold uppercase ${getBadgeStyle(item.kategori)}`}>
                      {item.kategori}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.jam_mulai ? `${item.jam_mulai} ${item.jam_selesai ? `- ${item.jam_selesai}` : ""} WIB` : "Seharian"}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{item.judul}</h3>
                  {item.deskripsi && <p className="text-xs text-slate-400">{item.deskripsi}</p>}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit Agenda"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Hapus Agenda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}