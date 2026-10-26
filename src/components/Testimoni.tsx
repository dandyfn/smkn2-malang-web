"use client";

import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Testimonial = {
  id: string;
  author_name: string;
  rating: number;
  body: string;
  profile_url: string | null;
  time_label: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

// Tautan resmi ke halaman SMKN 2 Malang di Google Maps
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=SMK%20Negeri%202%20Malang&query_place_id=ChIJC6HGQHmCeC4RFPN3cQ2SmRw";

export default function Testimoni() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data) setReviews(data as Testimonial[]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const hasReviews = reviews.length > 0;

  return (
    <div className="w-full h-full bg-white text-slate-900 py-20 px-6 flex flex-col justify-center items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block mb-3">
            Ulasan Publik
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kepercayaan Publik yang Terverifikasi
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Ulasan pilihan dari Google Maps. Baca seluruh ulasan langsung di Google Maps.
          </p>
        </div>

        {/* Skeleton saat memuat */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Grid Kartu Ulasan */}
        {!loading && hasReviews && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-50/70 border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-xs hover:border-slate-300 transition"
              >
                <div>
                  {/* Logo Google & Star Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-blue-600 text-base tracking-tight">
                      Google
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Teks Ulasan */}
                  <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed whitespace-pre-line">
                    “{rev.body}”
                  </p>
                </div>

                {/* Penulis */}
                <div className="mt-5">
                  {rev.profile_url ? (
                    <a
                      href={rev.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-800 hover:underline"
                    >
                      {rev.author_name}
                    </a>
                  ) : (
                    <p className="text-xs font-bold text-slate-800">{rev.author_name}</p>
                  )}
                  {rev.time_label && (
                    <p className="text-[11px] text-slate-400">{rev.time_label}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tombol ke Google Maps */}
        {!loading && (
          <div className="text-center mt-8">
            <a
              href= "https://maps.app.goo.gl/3kXvJ4cAy6UTst2U7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition"
            >
              Lihat semua ulasan di Google Maps
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-[11px] text-slate-400 mt-3">Sumber ulasan: Google Maps</p>
          </div>
        )}
      </div>
    </div>
  );
}