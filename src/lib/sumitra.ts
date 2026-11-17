// Mengambil data Sumitra Kelana Wisata dari Supabase untuk halaman /sumitra.
// Setiap tabel yang gagal dibaca (misalnya SQL belum dijalankan) diganti data cadangan
// di src/data/sumitra.ts, sehingga halaman tetap tampil.
import { supabase } from "@/lib/supabase";
import {
  SUMITRA_PENGATURAN, SUMITRA_PAKET, SUMITRA_LAYANAN, SUMITRA_FAQ, SUMITRA_MITRA, perBaris,
  type Paket, type Layanan, type GaleriItem, type Testimoni, type FaqItem, type Mitra, type Pengaturan,
  type JenisPaket, type IkonLayanan, type FieldWa,
} from "@/data/sumitra";

/* ---------- Bentuk baris di tabel Supabase (dipakai juga oleh panel admin) ---------- */
export type PengaturanRow = {
  id: number; nomor_wa: string; instagram: string; facebook: string; jam_buka: string; besaran_dp: string;
  aturan_tambahan: string; logo_url: string | null; hero_foto_url: string | null; tentang_foto_url: string | null;
  updated_at: string;
};
export type PaketRow = {
  id: string; slug: string; jenis: JenisPaket; nama: string; ringkasan: string; durasi: string; jadwal: string;
  harga_mulai: number | null; satuan_harga: string; catatan_harga: string; termasuk: string; susunan_acara: string;
  foto_url: string | null; is_published: boolean; sort_order: number; created_at: string;
};
export type LayananRow = {
  id: string; nama: string; ikon: IkonLayanan; deskripsi: string; harga_mulai: number | null; satuan_harga: string;
  label_harga: string; field_wa: FieldWa[]; is_published: boolean; sort_order: number; created_at: string;
};
export type StatusPesanan = "baru" | "dp" | "lunas" | "selesai" | "batal";
export type PesananRow = {
  id: string; kode: string; jenis: "paket" | "layanan"; item_id: string | null; item_nama: string; nama: string;
  no_wa: string; tanggal: string | null; jumlah: number | null; lokasi: string; lama: string; cara_bayar: string;
  catatan: string; setuju_syarat: boolean; status: StatusPesanan; catatan_admin: string; created_at: string; updated_at: string;
};
export type GaleriRow = {
  id: string; foto_url: string; keterangan: string; paket_id: string | null; is_published: boolean;
  created_by: string | null; created_at: string;
};
export type TestimoniRow = {
  id: string; nama: string; perjalanan: string; rating: number; isi: string; foto_url: string | null;
  balasan: string | null; dibalas_at: string | null; is_published: boolean; sort_order: number; created_at: string;
};
export type FaqRow = {
  id: string; nama_penanya: string | null; pertanyaan: string; jawaban: string | null;
  is_published: boolean; sort_order: number; created_at: string;
};
export type MitraRow = {
  id: string; nama: string; logo_url: string | null; is_published: boolean; sort_order: number; created_at: string;
};

/* ---------- Pengubah baris -> bentuk tampilan ---------- */
export function keDataPengaturan(r: PengaturanRow): Pengaturan {
  return {
    nomorWa: r.nomor_wa ?? "", instagram: r.instagram ?? "", facebook: r.facebook ?? "", jamBuka: r.jam_buka ?? "",
    besaranDp: r.besaran_dp ?? "", aturanTambahan: perBaris(r.aturan_tambahan), logoUrl: r.logo_url,
    heroFotoUrl: r.hero_foto_url, tentangFotoUrl: r.tentang_foto_url,
  };
}
export function keDataPaket(r: PaketRow): Paket {
  return {
    id: r.id, slug: r.slug, jenis: r.jenis, nama: r.nama, ringkasan: r.ringkasan ?? "", durasi: r.durasi ?? "",
    jadwal: r.jadwal ?? "", hargaMulai: r.harga_mulai, satuanHarga: r.satuan_harga ?? "", catatanHarga: r.catatan_harga ?? "",
    termasuk: perBaris(r.termasuk), susunanAcara: perBaris(r.susunan_acara), fotoUrl: r.foto_url,
  };
}
export function keDataLayanan(r: LayananRow): Layanan {
  return {
    id: r.id, nama: r.nama, ikon: r.ikon, deskripsi: r.deskripsi ?? "", hargaMulai: r.harga_mulai,
    satuanHarga: r.satuan_harga ?? "", labelHarga: r.label_harga ?? "", fieldWa: r.field_wa ?? [],
  };
}

export type SumitraData = {
  pengaturan: Pengaturan;
  paket: Paket[];
  layanan: Layanan[];
  galeri: GaleriItem[];
  testimoni: Testimoni[];
  faq: FaqItem[];
  mitra: Mitra[];
};

export async function getSumitraData(): Promise<SumitraData> {
  try {
    const [pg, pk, ly, gl, ts, fq, mt] = await Promise.all([
      supabase.from("sumitra_pengaturan").select("*").eq("id", 1).maybeSingle(),
      supabase.from("sumitra_paket").select("*").eq("is_published", true).order("sort_order").order("created_at"),
      supabase.from("sumitra_layanan").select("*").eq("is_published", true).order("sort_order").order("created_at"),
      supabase.from("sumitra_galeri").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(9),
      supabase.from("sumitra_testimoni").select("*").eq("is_published", true).order("sort_order").order("created_at", { ascending: false }),
      supabase.from("sumitra_faq").select("*").eq("is_published", true).not("jawaban", "is", null).order("sort_order").order("created_at"),
      supabase.from("sumitra_mitra").select("*").eq("is_published", true).order("sort_order").order("created_at"),
    ]);

    return {
      pengaturan: !pg.error && pg.data ? keDataPengaturan(pg.data as PengaturanRow) : SUMITRA_PENGATURAN,
      paket: pk.error ? SUMITRA_PAKET : (pk.data as PaketRow[]).map(keDataPaket),
      layanan: ly.error ? SUMITRA_LAYANAN : (ly.data as LayananRow[]).map(keDataLayanan),
      galeri: gl.error ? [] : (gl.data as GaleriRow[]).map((r) => ({ id: r.id, fotoUrl: r.foto_url, keterangan: r.keterangan })),
      testimoni: ts.error
        ? []
        : (ts.data as TestimoniRow[]).map((r) => ({
            id: r.id, nama: r.nama, perjalanan: r.perjalanan, rating: r.rating, isi: r.isi, fotoUrl: r.foto_url, balasan: r.balasan,
          })),
      faq: fq.error ? SUMITRA_FAQ : (fq.data as FaqRow[]).map((r) => ({ q: r.pertanyaan, a: r.jawaban ?? "" })),
      mitra: mt.error ? SUMITRA_MITRA : (mt.data as MitraRow[]).map((r) => ({ id: r.id, nama: r.nama, logoUrl: r.logo_url })),
    };
  } catch {
    return {
      pengaturan: SUMITRA_PENGATURAN, paket: SUMITRA_PAKET, layanan: SUMITRA_LAYANAN,
      galeri: [], testimoni: [], faq: SUMITRA_FAQ, mitra: SUMITRA_MITRA,
    };
  }
}

/** Satu paket berdasarkan slug, untuk halaman /sumitra/paket/[slug]. */
export async function getPaketSumitra(slug: string): Promise<{ paket: Paket | null; pengaturan: Pengaturan }> {
  try {
    const [pk, pg] = await Promise.all([
      supabase.from("sumitra_paket").select("*").eq("slug", slug).eq("is_published", true).maybeSingle(),
      supabase.from("sumitra_pengaturan").select("*").eq("id", 1).maybeSingle(),
    ]);
    const pengaturan = !pg.error && pg.data ? keDataPengaturan(pg.data as PengaturanRow) : SUMITRA_PENGATURAN;
    if (pk.error) return { paket: SUMITRA_PAKET.find((p) => p.slug === slug) ?? null, pengaturan };
    return { paket: pk.data ? keDataPaket(pk.data as PaketRow) : null, pengaturan };
  } catch {
    return { paket: SUMITRA_PAKET.find((p) => p.slug === slug) ?? null, pengaturan: SUMITRA_PENGATURAN };
  }
}
