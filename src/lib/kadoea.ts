// Mengambil data KADOEA (paket, FAQ, ulasan) dari Supabase untuk halaman /kadoea.
// Jika tabel belum dibuat atau koneksi gagal, halaman memakai data cadangan di src/data/kadoea.ts
// supaya tetap tampil normal.
import { supabase } from "@/lib/supabase";
import { KADOEA_PAKET, KADOEA_FAQ, KADOEA_ULASAN, type Paket, type Ulasan } from "@/data/kadoea";

export type FaqItem = { q: string; a: string };

// Bentuk baris di tabel Supabase
export type PaketRow = {
  id: string; nama: string; ringkas: string; harga: string; satuan: string;
  fitur: string[]; unggulan: boolean; is_published: boolean; sort_order: number; created_at: string;
};
export type FaqRow = {
  id: string; nama_penanya: string | null; pertanyaan: string; jawaban: string | null;
  is_published: boolean; sort_order: number; created_at: string;
};
export type UlasanRow = {
  id: string; nama: string; rating: number; isi: string; waktu: string | null; profile_url: string | null;
  sumber: "google" | "pengunjung"; balasan: string | null; dibalas_at: string | null; is_published: boolean; sort_order: number; created_at: string;
};

export async function getKadoeaData(): Promise<{ paket: Paket[]; faq: FaqItem[]; ulasan: Ulasan[] }> {
  try {
    const [p, f, u] = await Promise.all([
      supabase.from("kadoea_paket").select("*").eq("is_published", true).order("sort_order").order("created_at"),
      supabase.from("kadoea_faq").select("*").eq("is_published", true).not("jawaban", "is", null).order("sort_order").order("created_at"),
      supabase.from("kadoea_ulasan").select("*").eq("is_published", true).order("sort_order").order("created_at", { ascending: false }),
    ]);

    // Tabel belum ada / gagal dibaca -> pakai seluruh data cadangan
    if (p.error || f.error || u.error) {
      return { paket: KADOEA_PAKET, faq: KADOEA_FAQ, ulasan: KADOEA_ULASAN };
    }

    return {
      paket: (p.data as PaketRow[]).map((r) => ({
        nama: r.nama, ringkas: r.ringkas, harga: r.harga, satuan: r.satuan, fitur: r.fitur ?? [], unggulan: r.unggulan,
      })),
      faq: (f.data as FaqRow[]).map((r) => ({ q: r.pertanyaan, a: r.jawaban ?? "" })),
      ulasan: (u.data as UlasanRow[]).map((r) => ({
        nama: r.nama, rating: r.rating, isi: r.isi, waktu: r.waktu ?? undefined, profileUrl: r.profile_url ?? undefined,
        sumber: r.sumber ?? "google", balasan: r.balasan ?? undefined,
      })),
    };
  } catch {
    return { paket: KADOEA_PAKET, faq: KADOEA_FAQ, ulasan: KADOEA_ULASAN };
  }
}
