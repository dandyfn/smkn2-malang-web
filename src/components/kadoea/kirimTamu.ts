// Pembatas ringan agar pengunjung tidak mengirim berkali-kali dalam waktu singkat.
// Disimpan di browser pengunjung (localStorage), sama seperti form FAQ di beranda sekolah.
export const JEDA_MS = 60_000;

export function masihJeda(kunci: string): boolean {
  try {
    return Date.now() - Number(localStorage.getItem(kunci) ?? 0) < JEDA_MS;
  } catch {
    return false;
  }
}

export function catatKirim(kunci: string) {
  try {
    localStorage.setItem(kunci, String(Date.now()));
  } catch {
    // localStorage tidak tersedia (mode privat), abaikan
  }
}

export const inputTamuCls =
  "w-full bg-white border border-slate-300 rounded-xl p-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition";
