import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { supabase } from "@/lib/supabase";

// Sitemap dibuat ulang paling cepat tiap 1 jam, jadi konten baru ikut masuk otomatis
export const revalidate = 3600;

const HALAMAN = [
  "",
  "/profil",
  "/konsentrasi-keahlian",
  "/ekstrakurikuler",
  "/fasilitas",
  "/prestasi",
  "/organisasi",
  "/kalender",
  "/kontak",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const halamanStatis: MetadataRoute.Sitemap = HALAMAN.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  let halamanBerita: MetadataRoute.Sitemap = [];
  let halamanPrestasi: MetadataRoute.Sitemap = [];

  // Kalau Supabase gagal dihubungi, sitemap tetap jadi dan build tidak gagal
  try {
    const { data: berita } = await supabase
      .from("berita")
      .select("slug, id, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    halamanBerita = (berita ?? []).map((b) => ({
      url: `${SITE_URL}/berita/${b.slug || b.id}`,
      lastModified: new Date(b.created_at),
    }));

    const { data: prestasi } = await supabase.from("prestasi").select("id");

    halamanPrestasi = (prestasi ?? []).map((p) => ({
      url: `${SITE_URL}/prestasi/${p.id}`,
    }));
  } catch (err) {
    console.error("Sitemap: gagal mengambil data", err);
  }

  return [...halamanStatis, ...halamanBerita, ...halamanPrestasi];
}