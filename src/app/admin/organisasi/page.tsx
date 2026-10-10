"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, Users, Plus, Search, Edit3, Trash2, 
  Upload, X, Save, Sparkles, User, Mail, Phone, RefreshCw, Loader2 
} from "lucide-react";
import Link from "next/link";

interface Guru {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  kejuruan: string;
  email: string;
  kontak: string;
  foto_url: string;
  created_at?: string;
}

const DAFTAR_KEJURUAN = [
  "Manajerial Sekolah",
  "Teknik Komputer dan Jaringan",
  "Perhotelan",
  "Kuliner",
  "Layanan Penunjang Keperawatan",
  "Pekerjaan Sosial",
  "Usaha Layanan Wisata",
];

export default function AdminOrganisasiPage() {
  const router = useRouter();
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [kejuruan, setKejuruan] = useState(DAFTAR_KEJURUAN[0]);
  const [email, setEmail] = useState("");
  const [kontak, setKontak] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const BUCKET_NAME = "gambar coba";

  const fetchGuru = async () => {
    const { data } = await supabase
      .from("guru")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setGuruList(data);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else fetchGuru();
    };
    checkAuth();
  }, [router]);

  // Upload Foto Profil Guru
  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFoto(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `guru-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        setFotoUrl(publicUrlData.publicUrl);
      }
    } catch (err: any) {
      alert("Gagal mengunggah foto: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setUploadingFoto(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNama("");
    setNip("");
    setJabatan("");
    setKejuruan(DAFTAR_KEJURUAN[0]);
    setEmail("");
    setKontak("");
    setFotoUrl("");
  };

  const handleSave = async () => {
    if (!nama || !kejuruan) {
      return alert("Nama Guru dan Kejuruan wajib diisi!");
    }

    setLoading(true);

    const payload = {
      nama,
      nip,
      jabatan,
      kejuruan,
      email,
      kontak,
      foto_url: fotoUrl,
    };

    if (editingId) {
      const { error } = await supabase
        .from("guru")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert("Gagal memperbarui data guru: " + error.message);
      } else {
        alert("Data guru berhasil diperbarui!");
        resetForm();
        fetchGuru();
      }
    } else {
      const { error } = await supabase.from("guru").insert([payload]);

      if (error) {
        alert("Gagal menambahkan data guru: " + error.message);
      } else {
        alert("Data guru berhasil ditambahkan!");
        resetForm();
        fetchGuru();
      }
    }

    setLoading(false);
  };

  const handleEditClick = (item: Guru) => {
    setEditingId(item.id);
    setNama(item.nama);
    setNip(item.nip || "");
    setJabatan(item.jabatan || "");
    setKejuruan(item.kejuruan || DAFTAR_KEJURUAN[0]);
    setEmail(item.email || "");
    setKontak(item.kontak || "");
    setFotoUrl(item.foto_url || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data guru ini?")) return;
    await supabase.from("guru").delete().eq("id", id);
    if (editingId === id) resetForm();
    fetchGuru();
  };

  const filteredGuru = guruList.filter((g) =>
    g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.nip && g.nip.includes(searchTerm)) ||
    (g.jabatan && g.jabatan.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <Users className="w-5 h-5 text-amber-400" /> Kelola Data Guru & Staf
          </h1>
          <p className="text-xs text-slate-400">Tambah dan kelola pendidik serta tenaga kependidikan SMKN 2 Malang</p>
        </div>
      </div>

      {/* Form Input / Edit Guru */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 
            {editingId ? "Edit Data Guru" : "Form Tambah Data Guru"}
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

        {/* Row 1: Nama & NIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">NIP</label>
            <input
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>
        </div>

        {/* Row 2: Jabatan & Kejuruan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Jabatan Manajerial (Opsional)</label>
            <input
              type="text"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Konsentrasi Keahlian / Kejuruan *</label>
            <select
              value={kejuruan}
              onChange={(e) => setKejuruan(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white cursor-pointer"
            >
              {DAFTAR_KEJURUAN.map((k) => (
                <option key={k} value={k} className="bg-slate-900 text-white">
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Email & Kontak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Email Official</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Kontak / Nomor HP</label>
            <input
              type="text"
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>
        </div>

        {/* Foto Profil */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Foto Profil Guru</label>
          <div className="space-y-2">
            <label className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition">
              {uploadingFoto ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Upload className="w-4 h-4 text-amber-400" />
              )}
              <span>Upload Foto Profil dari Perangkat</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoUpload}
                disabled={uploadingFoto}
                className="hidden"
              />
            </label>

            <input
              type="text"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          {fotoUrl && (
            <div className="mt-2 flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800 max-w-sm">
              <img src={fotoUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
              <span className="text-[10px] text-slate-400 truncate flex-1">{fotoUrl}</span>
              <button
                type="button"
                onClick={() => setFotoUrl("")}
                className="p-1 hover:text-red-400 text-slate-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={loading || uploadingFoto}
            onClick={handleSave}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Menyimpan..." : editingId ? "Perbarui Data Guru" : "Simpan Data Guru"}
          </button>
        </div>
      </div>

      {/* List Data Guru */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-400">Daftar Pendidik & Tenaga Kependidikan</h2>

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

        {filteredGuru.length === 0 ? (
          <p className="text-xs text-slate-600 italic">Belum ada data guru ditemukan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredGuru.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-start gap-3 justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-slate-600">
                    {item.foto_url ? (
                      <img src={item.foto_url} alt={item.nama} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white leading-tight">{item.nama}</h3>
                    {item.nip && <p className="text-[11px] text-slate-400 font-mono">NIP. {item.nip}</p>}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.jabatan && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded">
                          {item.jabatan}
                        </span>
                      )}
                      <span className="text-[10px] bg-slate-800 text-sky-400 px-2 py-0.5 rounded font-medium">
                        {item.kejuruan}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit Guru"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Hapus Guru"
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