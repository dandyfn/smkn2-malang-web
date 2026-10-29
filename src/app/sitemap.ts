import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import { DATA_EKSTRAKURIKULER } from "@/data/ekstrakurikuler";
import { DATA_KONSENTRASI } from "@/data/konsentrasi-keahlian";

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

  const halamanEkskul: MetadataRoute.Sitemap = DATA_EKSTRAKURIKULER.map((e) => ({
    url: `${SITE_URL}/ekstrakurikuler/${e.slug}`,
  }));

  const halamanKonsentrasi: MetadataRoute.Sitemap = DATA_KONSENTRASI.map((k) => ({
    url: `${SITE_URL}/konsentrasi-keahlian/${k.id}`,
  }));

  let halamanBerita: MetadataRoute.Sitemap = [];
  let halamanPrestasi: MetadataRoute.Sitemap = [];

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

  return [
    ...halamanStatis,
    ...halamanEkskul,
    ...halamanKonsentrasi,
    ...halamanBerita,
    ...halamanPrestasi,
  ];
}