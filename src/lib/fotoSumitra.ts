// Kompres foto di browser lalu unggah ke bucket Supabase "sumitra".
// Foto HP biasanya 3-8 MB; dikecilkan dulu (sisi terpanjang maks 1600 px, JPEG 80%)
// supaya hemat kuota siswa/pengunjung dan cepat dimuat di website.
import { supabase } from "@/lib/supabase";

export const BUCKET_SUMITRA = "sumitra";
export type FolderFoto = "paket" | "galeri" | "testimoni" | "mitra" | "situs";

export async function kompresGambar(file: File, sisiMaks = 1600, kualitas = 0.8): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("Gambar tidak bisa dibaca. Coba foto lain (format JPG/PNG).");

  const skala = Math.min(1, sisiMaks / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * skala);
  const h = Math.round(bitmap.height * skala);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser tidak mendukung kompres gambar.");
  ctx.fillStyle = "#ffffff"; // latar putih untuk PNG transparan
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", kualitas));
  if (!blob) throw new Error("Gagal mengompres gambar.");
  return blob;
}

/** Kompres + unggah, mengembalikan URL publik foto. */
export async function unggahFotoSumitra(file: File, folder: FolderFoto, sisiMaks = 1600): Promise<string> {
  const blob = await kompresGambar(file, sisiMaks);
  const nama = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(BUCKET_SUMITRA).upload(nama, blob, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error("Gagal mengunggah foto: " + error.message);
  return supabase.storage.from(BUCKET_SUMITRA).getPublicUrl(nama).data.publicUrl;
}

/** Hapus file di bucket berdasarkan URL publiknya (dipakai saat foto diganti/dihapus). */
export async function hapusFotoSumitra(url: string | null | undefined) {
  if (!url) return;
  const penanda = `/storage/v1/object/public/${BUCKET_SUMITRA}/`;
  const i = url.indexOf(penanda);
  if (i < 0) return;
  await supabase.storage.from(BUCKET_SUMITRA).remove([decodeURIComponent(url.slice(i + penanda.length))]);
}
