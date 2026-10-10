"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, Trash2, Trophy, 
  Image as ImageIcon, Video, Plus, X, Edit3, Save, Sparkles, Upload, Loader2, ChevronDown, FileText, Send
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import Dynamic Tiptap Editor tanpa SSR
const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
  loading: () => <div className="h-40 bg-slate-950 border border-slate-800 rounded-xl animate-pulse flex items-center justify-center text-xs text-slate-500">Memuat Editor...</div>
});

interface Prestasi {
  id: string;
  judul: string;
  kategori: string;
  tingkat?: string;
  tanggal: string;
  banner_url: string;
  deskripsi_lengkap: string;
  galeri_foto: string[];
  video_url: string;
  status: "published" | "draft";
  created_at?: string;
}

export default function AdminPrestasiPage() {
  const router = useRouter();
  const [prestasiList, setPrestasiList] = useState<Prestasi[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("Nasional");
  const [tanggal, setTanggal] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [deskripsiHtml, setDeskripsiHtml] = useState("");
  const [galeriFoto, setGaleriFoto] = useState<string[]>([]);
  const [inputFotoUrl, setInputFotoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");

  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGaleri, setUploadingGaleri] = useState(false);

  const BUCKET_NAME = "gambar coba";

  const fetchPrestasi = async () => {
    const { data } = await supabase
      .from("prestasi")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPrestasiList(data);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else fetchPrestasi();
    };
    checkAuth();
  }, [router]);

  // Upload Foto Banner Utama
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-prestasi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        setBannerUrl(publicUrlData.publicUrl);
      }
    } catch (err: any) {
      alert("Gagal mengunggah banner: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setUploadingBanner(false);
    }
  };

  // Upload Foto ke Galeri
  const handleGaleriUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGaleri(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `galeri-prestasi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      setGaleriFoto((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      alert("Gagal mengunggah foto galeri: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setUploadingGaleri(false);
    }
  };

  const handleAddGaleriUrl = () => {
    if (!inputFotoUrl.trim()) return;
    setGaleriFoto((prev) => [...prev, inputFotoUrl.trim()]);
    setInputFotoUrl("");
  };

  const handleRemoveGaleriFoto = (index: number) => {
    setGaleriFoto(galeriFoto.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setEditingId(null);
    setJudul("");
    setKategori("Nasional");
    setTanggal("");
    setBannerUrl("");
    setDeskripsiHtml("");
    setGaleriFoto([]);
    setInputFotoUrl("");
    setVideoUrl("");
    setStatus("published");
  };

  // Handler Simpan Data (Menerima parameter targetStatus: 'published' | 'draft')
  const handleSave = async (targetStatus: "published" | "draft") => {
    if (!judul || !bannerUrl || !deskripsiHtml || deskripsiHtml === "<p></p>") {
      return alert("Judul, Banner Utama, dan Deskripsi Lengkap wajib diisi!");
    }

    setLoading(true);

    const payload = {
      judul,
      kategori,
      tingkat: kategori,
      tanggal: tanggal || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      banner_url: bannerUrl,
      deskripsi_lengkap: deskripsiHtml,
      galeri_foto: galeriFoto,
      video_url: videoUrl,
      status: targetStatus,
    };

    if (editingId) {
      const { error } = await supabase
        .from("prestasi")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert("Gagal memperbarui prestasi: " + error.message);
      } else {
        alert(targetStatus === "draft" ? "Prestasi disimpan sebagai Draf!" : "Prestasi berhasil dipublikasikan!");
        resetForm();
        fetchPrestasi();
      }
    } else {
      const { error } = await supabase.from("prestasi").insert([payload]);

      if (error) {
        alert("Gagal menambahkan prestasi: " + error.message);
      } else {
        alert(targetStatus === "draft" ? "Prestasi disimpan sebagai Draf!" : "Prestasi berhasil dipublikasikan!");
        resetForm();
        fetchPrestasi();
      }
    }

    setLoading(false);
  };

  const handleEditClick = (item: Prestasi) => {
    setEditingId(item.id);
    setJudul(item.judul);
    setKategori(item.kategori || item.tingkat || "Nasional");
    setTanggal(item.tanggal || "");
    setBannerUrl(item.banner_url || "");
    setDeskripsiHtml(item.deskripsi_lengkap || "");
    setGaleriFoto(item.galeri_foto || []);
    setVideoUrl(item.video_url || "");
    setStatus(item.status || "published");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus prestasi ini?")) return;
    await supabase.from("prestasi").delete().eq("id", id);
    if (editingId === id) resetForm();
    fetchPrestasi();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Style Global Tiptap Editor Content */}
      <style jsx global>{`
        .ProseMirror p { margin-bottom: 0.5rem; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; color: #f8fafc; margin-top: 1rem; margin-bottom: 0.5rem; }
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; color: #f1f5f9; margin-top: 0.75rem; margin-bottom: 0.5rem; }
        .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; color: #cbd5e1; margin-top: 0.5rem; margin-bottom: 0.25rem; }
        .ProseMirror blockquote { border-left: 3px solid #f59e0b; padding-left: 0.75rem; color: #94a3b8; font-style: italic; }
      `}</style>

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
            <Trophy className="w-5 h-5 text-amber-400" /> Kelola Prestasi
          </h1>
          <p className="text-xs text-slate-400">Tambah dan perbarui catatan prestasi siswa & sekolah</p>
        </div>
      </div>

      {/* Form Input / Edit */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 
            {editingId ? "Edit Data Prestasi" : "Form Tambah Prestasi Baru"}
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

        {/* Row 1: Judul & Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-400 mb-1 font-medium">Judul Prestasi *</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          <div className="relative">
            <label className="block text-xs text-slate-400 mb-1 font-medium">Tingkat / Kategori *</label>
            <div className="relative">
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-amber-500 text-white cursor-pointer appearance-none relative z-10"
              >
                <option value="Kota" className="bg-slate-900 text-white py-2">Kota / Kabupaten</option>
                <option value="Provinsi" className="bg-slate-900 text-white py-2">Provinsi</option>
                <option value="Nasional" className="bg-slate-900 text-white py-2">Nasional</option>
                <option value="Internasional" className="bg-slate-900 text-white py-2">Internasional</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-20" />
            </div>
          </div>
        </div>

        {/* Row 2: Tanggal & Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Tanggal Diraih</label>
            <input
              type="text"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Banner / Foto Utama *</label>
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition">
                {uploadingBanner ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <Upload className="w-4 h-4 text-amber-400" />
                )}
                <span>Upload Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={uploadingBanner}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500 text-white"
              />
            </div>

            {bannerUrl && (
              <div className="mt-2 flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                <img src={bannerUrl} alt="Preview" className="w-10 h-10 object-cover rounded" />
                <span className="text-[10px] text-slate-400 truncate flex-1">{bannerUrl}</span>
                <button
                  type="button"
                  onClick={() => setBannerUrl("")}
                  className="p-1 hover:text-red-400 text-slate-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Deskripsi Lengkap dengan Tiptap Editor */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Deskripsi Lengkap Prestasi *</label>
          <TiptapEditor
            key={editingId || "new"}
            content={deskripsiHtml}
            onChange={(html) => setDeskripsiHtml(html)}
          />
        </div>

        {/* Galeri foto */}
        <div className="space-y-3 border-t border-slate-800 pt-4">
          <label className="block text-xs text-amber-400 font-semibold flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" /> Galeri Dokumentasi Foto (Opsional)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition">
              {uploadingGaleri ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Upload className="w-4 h-4 text-amber-400" />
              )}
              <span>Upload Foto Galeri dari Perangkat</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGaleriUpload}
                disabled={uploadingGaleri}
                className="hidden"
              />
            </label>


          </div>

          {/* List Foto Galeri */}
          {galeriFoto.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {galeriFoto.map((foto, index) => (
                <div key={index} className="relative group bg-slate-950 border border-slate-800 rounded-xl p-1 overflow-hidden">
                  <img src={foto} alt={`Galeri ${index}`} className="w-full h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGaleriFoto(index)}
                    className="absolute top-2 right-2 bg-red-600/90 p-1 rounded-md text-white opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Embed URL */}
        <div className="border-t border-slate-800 pt-4">
          <label className="block text-xs text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
            <Video className="w-4 h-4" /> Dokumentasi Video Embed URL (Opsional)
          </label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 text-white"
          />
        </div>

        {/* Action Buttons: Simpan Draf & Publikasikan */}
        <div className="pt-2 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={loading || uploadingBanner || uploadingGaleri}
            onClick={() => handleSave("draft")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            {loading ? "Menyimpan..." : "Simpan Draf"}
          </button>

          <button
            type="button"
            disabled={loading || uploadingBanner || uploadingGaleri}
            onClick={() => handleSave("published")}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? "Menyimpan..." : editingId ? "Perbarui & Publikasikan" : "Publikasikan Prestasi"}
          </button>
        </div>
      </div>

      {/* List Daftar Prestasi */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-400">Daftar Prestasi</h2>
        {prestasiList.length === 0 ? (
          <p className="text-xs text-slate-600 italic">Belum ada catatan prestasi.</p>
        ) : (
          <div className="grid gap-3">
            {prestasiList.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-start gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold uppercase">
                      Tingkat {item.kategori || item.tingkat}
                    </span>
                    {/* Badge Status Published / Draft */}
                    {item.status === "draft" ? (
                      <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">
                        Draf
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-medium">
                        Dipublikasi
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{item.tanggal}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{item.judul}</h3>
                  <div 
                    className="text-xs text-slate-400 line-clamp-1"
                    dangerouslySetInnerHTML={{ __html: item.deskripsi_lengkap }}
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit Prestasi"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Hapus Prestasi"
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