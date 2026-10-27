import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

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

export default function sitemap(): MetadataRoute.Sitemap {
  return HALAMAN.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}