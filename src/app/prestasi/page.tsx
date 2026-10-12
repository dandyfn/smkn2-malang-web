"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Trophy, Calendar, Search, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export interface Prestasi {
  id: string;
  judul: string;
  kategori: string;
  tingkat?: string;
  tanggal: string;
  banner_url: string;
  deskripsi_lengkap: string;
  galeri_foto: string[];
  video_url: string;
  status?: string;
}

export default function PrestasiPage() {
  const [prestasiList, setPrestasiList] = useState<Prestasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  // Ref untuk kontainer slider horizontal
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPrestasi = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("prestasi")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPrestasiList(data);
      }
      setLoading(false);
    };

    fetchPrestasi();
  }, []);

  // Fungsi scroll kiri & kanan
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth; // Scroll sejauh 1 lebar kontainer
      sliderRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  const filteredData = prestasiList.filter((item) => {
    const textContent = stripHtml(item.deskripsi_lengkap);
    const matchSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      textContent.toLowerCase().includes(searchTerm.toLowerCase());
    const katItem = item.kategori || item.tingkat || "";
    const matchKategori =
      filterKategori === "Semua" ||
      katItem.toLowerCase() === filterKategori.toLowerCase();

    return matchSearch && matchKategori;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative overflow-hidden">
      {/* CORAK GAMBAR 2D BAKAT & PRESTASI (SVG DOODLE PATTERN BERULANG) */}
{/* CORAK GAMBAR PRESTASI PRESISI */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url('/images/pola prestasi2.jpeg')`,
          backgroundRepeat: "repeat",
          backgroundSize: "170px auto", // Atur jarak/ukuran pola di sini
        }}
      />
    </div>

      <Header />

      <main className="flex-1 py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12 relative z-10">
        {/* HEADER SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black text-amber-900 uppercase tracking-widest bg-amber-400/30 px-4 py-1.5 rounded-full border border-amber-400 shadow-xs inline-block">
            PENCAPAIAN & PROSES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Prestasi Siswa SMKN 2 Malang
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Bukti nyata dedikasi, kerja keras, dan keunggulan kompetensi para peserta didik serta pembimbing di berbagai ajang kompetisi lokal, regional, hingga internasional.
          </p>
        </section>

        {/* SEARCH & FILTER */}
        <section className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari prestasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["Semua", "Kota", "Provinsi", "Nasional", "Internasional"].map((kat) => (
              <button
                key={kat}
                onClick={() => setFilterKategori(kat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  filterKategori === kat
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </section>

        {/* SLIDER CARD PRESTASI */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Memuat data prestasi...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-3xl border border-slate-200 p-8 relative z-20">
            < Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700">Belum Ada Prestasi Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Coba kata kunci pencarian lain atau pilih kategori yang berbeda.
            </p>
          </div>
        ) : (
          <section className="relative group">
            {/* Tombol Panah Kiri */}
            {filteredData.length > 3 && (
              <button
                onClick={() => scroll("left")}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-amber-500 hover:text-slate-950 text-slate-700 p-3 rounded-full border border-slate-200 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Geser ke Kiri"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Kontainer Horizontal Scroll Slider */}
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredData.map((item) => (
                <Link
                  key={item.id}
                  href={`/prestasi/${item.id}`}
                  className="snap-start shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white/95 backdrop-blur-xs border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 flex flex-col"
                >
                  {/* Gambar Banner / Thumbnail */}
                  <div className="relative h-52 bg-slate-100 overflow-hidden group">
                    <img
                      src={item.banner_url}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {item.kategori || item.tingkat}
                    </div>
                  </div>

                  {/* Detail Konten */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{item.tanggal}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg transition-colors line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {stripHtml(item.deskripsi_lengkap)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                      <span>Lihat Selengkapnya</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Tombol Panah Kanan */}
            {filteredData.length > 3 && (
              <button
                onClick={() => scroll("right")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-amber-500 hover:text-slate-950 text-slate-700 p-3 rounded-full border border-slate-200 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Geser ke Kanan"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}