"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, Trash2, Newspaper, Bold, Italic, 
  Underline as UnderlineIcon, List, ListOrdered, 
  Heading1, Heading2, Heading3, Quote, Link2, Image as ImageIcon, Sparkles, Edit3, X, Save, Upload, Loader2, Maximize2
} from "lucide-react";
import Link from "next/link";
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import ImageExtension from "@tiptap/extension-image";

interface Berita {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  deskripsi_singkat: string;
  banner_url: string;
  kategori: string;
  link_penting: string;
  status: "draft" | "published";
  created_at: string;
}

// Komponen React untuk merender Gambar + Tombol Kontrol langsung di dalam editor
const ComponentGambar = (props: any) => {
  const { node, updateAttributes, deleteNode } = props;
  const width = node.attrs.width || "30%";
  const [showControls, setShowControls] = useState(false);

  return (
    <NodeViewWrapper className="relative my-6 block text-center select-none">
      <div 
        className="relative inline-block max-w-full group"
        onClick={() => setShowControls((prev) => !prev)}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          style={{ width: width }}
          className={`mx-auto rounded-xl transition-all cursor-pointer block ${
            showControls ? "ring-4 ring-blue-500" : "hover:opacity-90"
          }`}
        />

        {/* Floating Toolbar Kontrol Ukuran */}
        <div className={`mt-2 inline-flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl shadow-xl transition-all ${showControls ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"}`}>
          <span className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1 mr-1">
            <Maximize2 className="w-3 h-3" /> Ukuran:
          </span>
          {/* Array Ukuran Diperbarui: 10%, 20%, 30%, 40%, 50% */}
          {["10%", "20%", "30%", "40%", "50%"].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateAttributes({ width: pct });
              }}
              className={`px-2 py-0.5 text-[10px] rounded font-semibold transition ${
                width === pct
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {pct}
            </button>
          ))}

          <div className="w-[1px] h-4 bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteNode();
            }}
            className="px-2 py-0.5 text-[10px] bg-red-600 hover:bg-red-500 rounded text-white font-semibold transition flex items-center gap-1"
            title="Hapus Gambar"
          >
            <Trash2 className="w-3 h-3" /> Hapus
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

// Extension Custom Image
const CustomImage = ImageExtension.extend({
  group: 'block',
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "30%",
        parseHTML: (element) => {
          return element.getAttribute("width") || element.style.width || "30%";
        },
        renderHTML: (attributes) => ({
          width: attributes.width,
          style: `width: ${attributes.width}`,
        }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ComponentGambar);
  },
});

// Toolbar Tiptap Editor Main Menu
const MenuBar = ({ editor, bucketName }: { editor: any; bucketName: string }) => {
  const [uploadingContentImg, setUploadingContentImg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingContentImg(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `konten-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        editor
          .chain()
          .focus()
          .setImage({ src: publicUrlData.publicUrl, width: "30%" })
          .run();
      }
    } catch (err: any) {
      alert("Gagal menyisipkan gambar: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setUploadingContentImg(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-900 border-b border-slate-800 rounded-t-xl text-slate-300">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive("bold") ? "text-amber-400 bg-slate-800 font-bold" : ""}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive("italic") ? "text-amber-400 bg-slate-800" : ""}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive("underline") ? "text-amber-400 bg-slate-800" : ""}`}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-5 bg-slate-800 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive("heading", { level: 1 }) ? "text-amber-400 bg-slate-800 font-bold" : ""}`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive("heading", { level: 2 }) ? "text-amber-400 bg-slate-800 font-bold" : ""}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-5 bg-slate-800 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive("bulletList") ? "text-amber-400 bg-slate-800" : ""}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive("orderedList") ? "text-amber-400 bg-slate-800" : ""}`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-5 bg-slate-800 mx-1" />

      {/* Insert Gambar ke Konten */}
      <label className="p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold text-xs" title="Sisipkan Gambar ke Konten">
        {uploadingContentImg ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImageIcon className="w-4 h-4" />
        )}
        <span>+ Gambar</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInsertImage}
          disabled={uploadingContentImg}
          className="hidden"
        />
      </label>

      <span className="text-[10px] text-slate-500 italic ml-auto hidden sm:inline">
        *Arahkan kursor atau klik gambar untuk memilih ukuran
      </span>
    </div>
  );
};

export default function AdminBeritaPage() {
  const router = useRouter();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [kategori, setKategori] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [deskripsiSingkat, setDeskripsiSingkat] = useState("");
  const [linkPenting, setLinkPenting] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const BUCKET_NAME = "gambar coba";

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Underline, 
      CustomImage,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "p-4 min-h-[220px] focus:outline-none text-slate-200 text-sm editor-custom-styles",
      },
    },
  });

  const handleJudulChange = (val: string) => {
    setJudul(val);
    if (!editingId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

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
    } catch (error: any) {
      alert("Gagal mengunggah gambar: " + (error.message || "Terjadi kesalahan"));
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchBerita = async () => {
    const { data } = await supabase
      .from("berita")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBeritaList(data);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else fetchBerita();
    };
    checkAuth();
  }, [router]);

  const resetForm = () => {
    setEditingId(null);
    setJudul("");
    setSlug("");
    setKategori("");
    setBannerUrl("");
    setDeskripsiSingkat("");
    setLinkPenting("");
    editor?.commands.setContent("");
  };

  const handleSave = async (statusTarget: "draft" | "published") => {
    const htmlContent = editor?.getHTML();

    if (!judul || !htmlContent || htmlContent === "<p></p>") {
      return alert("Judul dan isi artikel wajib diisi!");
    }

    setLoading(true);

    const payload = {
      judul,
      slug,
      kategori: kategori || "Berita",
      banner_url: bannerUrl,
      deskripsi_singkat: deskripsiSingkat,
      link_penting: linkPenting,
      konten: htmlContent,
      status: statusTarget,
    };

    if (editingId) {
      const { error } = await supabase
        .from("berita")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert("Gagal memperbarui berita: " + error.message);
      } else {
        alert(`Berita berhasil diperbarui (${statusTarget === 'published' ? 'Dipublikasikan' : 'Disimpan sebagai Draft'})!`);
        resetForm();
        fetchBerita();
      }
    } else {
      const { error } = await supabase.from("berita").insert([payload]);

      if (error) {
        alert("Gagal membuat berita: " + error.message);
      } else {
        alert(`Berita berhasil ${statusTarget === 'published' ? 'dipublikasikan' : 'disimpan sebagai draft'}!`);
        resetForm();
        fetchBerita();
      }
    }

    setLoading(false);
  };

  const handleEditClick = (item: Berita) => {
    setEditingId(item.id);
    setJudul(item.judul);
    setSlug(item.slug || "");
    setKategori(item.kategori || "");
    setBannerUrl(item.banner_url || "");
    setDeskripsiSingkat(item.deskripsi_singkat || "");
    setLinkPenting(item.link_penting || "");
    
    if (editor) {
      editor.commands.setContent(item.konten || "");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    await supabase.from("berita").delete().eq("id", id);
    if (editingId === id) resetForm();
    fetchBerita();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      <style jsx global>{`
        .editor-custom-styles h1 { font-size: 1.75rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; color: #f8fafc; }
        .editor-custom-styles h2 { font-size: 1.35rem; font-weight: 600; margin-top: 0.85rem; margin-bottom: 0.4rem; color: #f1f5f9; }
        .editor-custom-styles h3 { font-size: 1.15rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.3rem; color: #e2e8f0; }
        .editor-custom-styles ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .editor-custom-styles ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .editor-custom-styles blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; font-style: italic; color: #94a3b8; margin-top: 0.75rem; margin-bottom: 0.75rem; }
        .editor-custom-styles u { text-decoration: underline; }
        .editor-custom-styles p { margin-bottom: 0.5rem; }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <Link
          href="/admin/dashboard"
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-white">
            <Newspaper className="w-5 h-5 text-blue-400" /> Editor Berita
          </h1>
          <p className="text-xs text-slate-400">Kelola publikasi, draft, dan konten berita sekolah</p>
        </div>
      </div>

      {/* Form Tambah/Edit Berita */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-blue-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 
            {editingId ? "Edit Berita" : "Form Publikasi / Draft Berita"}
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

        {/* Row 1: Judul & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Judul Berita *</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => handleJudulChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Slug (URL Otomatis)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-400"
            />
          </div>
        </div>

        {/* Row 2: Kategori & Banner Image Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Kategori</label>
            <input
              type="text"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Banner / Foto Utama Berita
              </span>
            </label>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="flex-1 bg-slate-950 border border-slate-800 hover:border-blue-500/50 cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-2">
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span>Mengunggah Gambar...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>Upload Banner dari Perangkat</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="Atau tempel URL gambar di sini..."
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 text-white"
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

        {/* Row 3: Deskripsi Singkat & Link Penting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Deskripsi Singkat (Ringkasan Card)</label>
            <input
              type="text"
              value={deskripsiSingkat}
              onChange={(e) => setDeskripsiSingkat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5" /> Link Penting / Pendaftaran (Opsional)
            </label>
            <input
              type="text"
              value={linkPenting}
              onChange={(e) => setLinkPenting(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
        </div>

        {/* Tiptap Rich Text Editor */}
        <div>
          <label className="block text-xs text-slate-400 mb-1 font-medium">Isi Berita Lengkap (Docs Style)</label>
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-blue-500">
            <MenuBar editor={editor} bucketName={BUCKET_NAME} />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={loading || uploadingImage}
            onClick={() => handleSave("draft")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-2 border border-slate-700"
          >
            <Save className="w-4 h-4 text-amber-400" />
            {loading ? "Menyimpan..." : "Simpan sebagai Draft"}
          </button>

          <button
            type="button"
            disabled={loading || uploadingImage}
            onClick={() => handleSave("published")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "Menyimpan..." : editingId ? "Perbarui & Publikasikan" : "Publikasikan Sekarang"}
          </button>
        </div>
      </div>

      {/* Daftar Berita */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-400">Daftar Berita</h2>
        {beritaList.length === 0 ? (
          <p className="text-xs text-slate-600 italic">Belum ada berita yang ditambahkan.</p>
        ) : (
          <div className="grid gap-3">
            {beritaList.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-start gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold">
                      {item.kategori || "Berita"}
                    </span>
                    
                    {item.status === "draft" ? (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">
                        Draft
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                        Published
                      </span>
                    )}

                    {item.slug && <span className="text-[10px] text-slate-500">/{item.slug}</span>}
                  </div>
                  <h3 className="font-bold text-sm text-white">{item.judul}</h3>
                  <p className="text-xs text-slate-400">{item.deskripsi_singkat || "Tidak ada deskripsi singkat"}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit Berita"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Hapus Berita"
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