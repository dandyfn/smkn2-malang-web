"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface BeritaItem {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  deskripsi_singkat: string;
  banner_url: string;
  gambar_url?: string;
  kategori: string;
  status: "draft" | "published";
  created_at: string;
}

// Helper untuk konversi direct link PostImg jika dimasukkan link web
function getDirectImageUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.includes("postimg.cc") && !url.includes("i.postimg.cc")) {
    return url.replace("postimg.cc", "i.postimg.cc");
  }
  return url;
}

export default function Berita() {
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBerita = async () => {
      const { data } = await supabase
        .from("berita")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (data) setBeritaList(data);
      setLoading(false);
    };

    fetchBerita();
  }, []);

  // Fungsi untuk menggeser slider ke kiri/kanan sejauh lebar 1 card
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      // Geser kira-kira seukuran 1 item (1/3 dari total container)
      const scrollAmount = clientWidth / 3;
      sliderRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="berita" className="relative z-20 bg-slate-900 text-white py-24 px-6 border-b border-slate-800 shadow-[0_-30px_60px_rgba(0,0,0,0.9)]">
      {/* Hide Scrollbar Style */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Kabar Kampus
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Berita Terbaru
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {/* Tombol Navigasi Panah Geser (Hanya aktif/muncul jika berita > 3) */}
            {beritaList.length > 3 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white transition active:scale-95"
                  title="Geser Kiri"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white transition active:scale-95"
                  title="Geser Kanan"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

        
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-slate-800 rounded-2xl h-80 border border-slate-700"></div>
            ))}
          </div>
        ) : beritaList.length === 0 ? (
          <p className="text-slate-500 text-sm italic">Belum ada berita yang dipublikasikan.</p>
        ) : (
          /* Slider Container (Menggunakan Flex + Snap Scroll) */
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth pb-4"
          >
            {beritaList.map((item) => {
              const beritaUrl = `/berita/${item.slug || item.id}`;
              const imgSrc = getDirectImageUrl(item.banner_url || item.gambar_url);

              return (
                <div
                  key={item.id}
                  /* w-full md:w-[calc(33.333%-16px)] memastikan persis 3 item yang terlihat di desktop */
                  className="w-full md:w-[calc(33.333%-16px)] flex-shrink-0 snap-start bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl hover:border-amber-400/50 transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Link Gambar Banner */}
                    <Link href={beritaUrl} className="block overflow-hidden h-44 bg-slate-700 relative">
                      {imgSrc ? (
                        <img 
                          src={imgSrc} 
                          alt={item.judul}
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold px-4 text-center">
                          [ Foto {item.judul.slice(0, 20)}... ]
                        </div>
                      )}
                    </Link>

                    <div className="p-5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          {item.kategori || "Berita"}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <Link href={beritaUrl}>
                        <h4 className="font-bold text-white text-base leading-snug group-hover:text-amber-400 transition cursor-pointer line-clamp-2 mb-2">
                          {item.judul}
                        </h4>
                      </Link>

                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                        {item.deskripsi_singkat || item.konten.replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}